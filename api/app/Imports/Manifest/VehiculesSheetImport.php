<?php

namespace App\Imports\Manifest;

use App\Models\FollowUpFile;
use App\Models\Vehicle;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Concerns\SkipsErrors;
use Maatwebsite\Excel\Concerns\SkipsFailures;
use Maatwebsite\Excel\Concerns\SkipsOnError;
use Maatwebsite\Excel\Concerns\SkipsOnFailure;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class VehiculesSheetImport implements SkipsOnError, SkipsOnFailure, ToCollection, WithHeadingRow
{
    use SkipsErrors, SkipsFailures;

    public function __construct(private readonly ManifestContext $ctx) {}

    public function collection(Collection $rows)
    {
        foreach ($rows as $rowIndex => $row) {
            // Log detected headers once to align with real XLSX
            if (! $this->ctx->loggedVehicleHeaders) {
                $this->ctx->loggedVehicleHeaders = true;
                $headers = array_keys($row->toArray());
                Log::info('Manifest Vehicules headers', ['headers' => $headers]);
            }
            try {
                $vin = trim((string) ($this->getVal($row, ['vin___chassis', 'vin_chassis', 'vin-chassis', 'vin/chassis', 'vin', 'chassis', 'n°_chassis', 'n_chassis', 'numero_chassis', 'numéro_chassis']) ?? ''));
                $marque = trim((string) ($this->getVal($row, ['marque', 'make', 'marque_du_vehicule', 'brand']) ?? ''));
                $modele = trim((string) ($this->getVal($row, ['modele', 'modèle', 'model', 'modele_du_vehicule', 'modele_vehicule']) ?? ''));
                $type = trim((string) ($this->getVal($row, ['type', 'type_de_vehicule', 'categorie', 'catégorie']) ?? ''));
                $couleur = trim((string) ($this->getVal($row, ['couleur', 'color', 'couleur_du_vehicule']) ?? ''));
                $annee = $this->getVal($row, ['annee', 'année', 'year', 'annee_fabrication', 'année_fabrication']);
                $pays = trim((string) ($this->getVal($row, ['pays_origine', 'pays-origine', 'pays', 'origin_country', 'origin-country', 'pays_d_origine', 'pays-d-origine']) ?? ''));
                $proprietaire = trim((string) ($this->getVal($row, ['proprietaire_destinataire', 'proprietaire-destinataire', 'propriétaire_destinataire', 'proprietairedestinataire', 'owner', 'proprietaire', 'owner_name', 'owner-name', 'destinataire']) ?? ''));
                $bl = trim((string) ($this->getVal($row, ['connaissement_b_l', 'connaissement_bl', 'connaissement-b-l', 'connaissement', 'bill_of_lading', 'bill-of-lading', 'bl', 'b_l', 'b-l', 'b/l']) ?? ''));
                $emplacement = trim((string) ($this->getVal($row, ['emplacement_navire', 'emplacement-navire', 'ship_location', 'ship-location', 'emplacement']) ?? ''));
                // Vehicle condition comes from the Vehicules sheet "status" column (physical condition)
                $vehicleCondition = '';
                $fileStatus = '';
                $vehicleCondition = trim((string) ($this->getVal($row, ['status', 'statut', 'etat', 'état', 'vehicle_condition']) ?? ''));

                // Normalize known workflow status labels
                $statusMap = [
                    'ouvert' => 'OPEN',
                    'open' => 'OPEN',
                    'en_cours' => 'IN_PROGRESS',
                    'en-cours' => 'IN_PROGRESS',
                    'en cours' => 'IN_PROGRESS',
                    'in_progress' => 'IN_PROGRESS',
                    'in-progress' => 'IN_PROGRESS',
                    'closed' => 'CLOSED',
                    'ferme' => 'CLOSED',
                    'fermé' => 'CLOSED',
                    'pending' => 'PENDING',
                    'en_attente' => 'PENDING',
                    'en-attente' => 'PENDING',
                    'en attente' => 'PENDING',
                ];
                $allowedStatuses = ['OPEN', 'IN_PROGRESS', 'CLOSED', 'PENDING'];
                // Derive workflow status for FollowUpFile from the same "status" column
                if ($vehicleCondition !== '') {
                    $key = strtolower($vehicleCondition);
                    if (array_key_exists($key, $statusMap)) {
                        $fileStatus = $statusMap[$key];
                    } else {
                        $fileStatus = strtoupper($vehicleCondition);
                    }
                    if (! in_array($fileStatus, $allowedStatuses, true)) {
                        $fileStatus = 'PENDING';
                    }
                }
                $obs = trim((string) ($this->getVal($row, ['observations', 'observation', 'vehicle_observation', 'vehicle-observation', 'remarques']) ?? ''));
                $amorce = $this->getVal($row, ['amorce', 'is_primed', 'is-primed', 'apprete', 'apprêté']); // bool
                $poids = $this->getVal($row, ['poids_brut__kg_', 'poids_brut_kg', 'poids-brut-kg', 'poids', 'weight', 'poids_kg', 'poids_brut']);

                if ($vin === '' || $marque === '' || $modele === '' || $type === '' || $pays === '' || $bl === '') {
                    $this->ctx->skippedVehicles++;
                    // Add a more descriptive message on first miss
                    $msg = 'Véhicules ligne '.($rowIndex + 2).': données manquantes (VIN, Marque, Modèle, Type, Pays, B/L)';
                    if ($this->ctx->loggedVehicleHeaders) {
                        $msg .= ' — valeurs lues: '
                            .'vin='.$vin.', marque='.$marque.', modele='.$modele.', type='.$type.', pays='.$pays.', bl='.$bl;
                    }
                    $this->ctx->errors[] = $msg;

                    continue;
                }

                // De-dup by VIN
                $existing = Vehicle::where('vin', $vin)->first();
                if ($existing) {
                    $this->ctx->skippedVehicles++;
                    $this->ctx->errors[] = 'Véhicules ligne '.($rowIndex + 2).": VIN déjà existant ({$vin})";

                    continue;
                }

                if (! $this->ctx->portCall) {
                    // No port call created; record one error and skip rest without throwing per-row
                    if (! in_array('Véhicules: aucun PortCall créé en amont (feuille Navire manquante)', $this->ctx->errors, true)) {
                        $this->ctx->errors[] = 'Véhicules: aucun PortCall créé en amont (feuille Navire manquante)';
                    }
                    $this->ctx->skippedVehicles++;

                    continue;
                }

                DB::transaction(function () use ($vin, $marque, $modele, $annee, $proprietaire, $couleur, $type, $poids, $vehicleCondition, $fileStatus, $obs, $pays, $emplacement, $amorce, $bl) {
                    // Create vehicle
                    // Enforce unique B/L as per schema
                    if ($bl === '' || FollowUpFile::where('bill_of_lading', $bl)->exists()) {
                        throw new \RuntimeException("Conflit B/L: '{$bl}' déjà utilisé ou vide");
                    }

                    // Create vehicle
                    $vehicle = Vehicle::create([
                        'vin' => $vin,
                        'make' => $marque,
                        'model' => $modele,
                        'year' => is_numeric($annee) ? (int) $annee : null,
                        'owner_name' => $proprietaire ?: null,
                        'color' => $couleur ?: null,
                        'type' => $type,
                        'weight' => $poids !== null ? (string) $poids : '',
                        // Keep the raw physical condition from the sheet (default to 'Inconnu' if empty)
                        'vehicle_condition' => $vehicleCondition !== '' ? $vehicleCondition : 'Inconnu',
                        'vehicle_observation' => $obs ?: null,
                        'origin_country' => $pays,
                        'ship_location' => $emplacement ?: null,
                        'is_primed' => $this->toBool($amorce),
                        'discharge_id' => null,
                    ]);

                    $this->ctx->importedVehicles++;

                    // Create Follow Up File (one per vehicle)
                    FollowUpFile::create([
                        'bill_of_lading' => $bl,
                        // Use normalized workflow status if provided; default to PENDING
                        'status' => $fileStatus !== '' ? $fileStatus : 'PENDING',
                        'vehicle_id' => $vehicle->getKey(),
                        'port_call_id' => $this->ctx->portCall->getKey(),
                    ]);

                    $this->ctx->createdFollowUpFiles++;
                });
                Log::info("Vehicle imported: {$vin} with BL {$bl}");

            } catch (\Throwable $e) {
                $this->ctx->skippedVehicles++;
                $this->ctx->errors[] = 'Véhicules ligne '.($rowIndex + 2).': '.$e->getMessage();
            }
        }
    }

    public function headingRow(): int
    {
        return 1;
    }

    private function getVal($row, array $keys)
    {
        foreach ($keys as $k) {
            $variants = array_unique([
                $k,
                str_replace('_', '-', $k),
                str_replace('-', '_', $k),
                strtolower($k),
                strtoupper($k),
                // remove accents
                preg_replace('/[^a-z0-9_\-\/]/i', '', iconv('UTF-8', 'ASCII//TRANSLIT', $k) ?: $k),
                // remove separators entirely
                str_replace(['_', '-', '/'], '', strtolower(iconv('UTF-8', 'ASCII//TRANSLIT', $k) ?: $k)),
            ]);
            foreach ($variants as $vk) {
                if (isset($row[$vk]) && $row[$vk] !== '') {
                    return $row[$vk];
                }
            }
        }

        return null;
    }

    private function toBool($value): bool
    {
        if (is_bool($value)) {
            return $value;
        }
        $v = strtolower(trim((string) $value));
        if (in_array($v, ['1', 'true', 'yes', 'on', 'oui'])) {
            return true;
        }
        if (in_array($v, ['0', 'false', 'no', 'off', 'non'])) {
            return false;
        }

        return filter_var($value, FILTER_VALIDATE_BOOLEAN);
    }
}
