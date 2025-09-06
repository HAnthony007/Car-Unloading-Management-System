<?php

namespace App\Imports\Manifest;

use App\Models\PortCall;
use App\Models\Vessel;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Concerns\SkipsErrors;
use Maatwebsite\Excel\Concerns\SkipsFailures;
use Maatwebsite\Excel\Concerns\SkipsOnError;
use Maatwebsite\Excel\Concerns\SkipsOnFailure;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class NavireSheetImport implements SkipsOnError, SkipsOnFailure, ToCollection, WithHeadingRow
{
    use SkipsErrors, SkipsFailures;

    public function __construct(private readonly ManifestContext $ctx) {}

    public function collection(Collection $rows)
    {
        // Support key-value layout: columns like 'champ' and 'valeur' (or column named '4')
        $kv = [];
        foreach ($rows as $rowIndex => $row) {
            // Log headers once for diagnostics
            if (! $this->ctx->loggedNavireHeaders) {
                $this->ctx->loggedNavireHeaders = true;
                $headers = array_keys($row->toArray());
                Log::info('Manifest Navire headers', ['headers' => $headers]);
            }
            $keys = array_map('strval', array_keys($row->toArray()));
            $keyCol = null;
            $valCol = null;
            foreach ($keys as $k) {
                $nk = $this->normalize($k);
                if (in_array($nk, ['champ', 'field'])) {
                    $keyCol = $k; // original key used to access value
                }
                if (in_array($nk, ['valeur', 'value', 'valeur/champ', 'valeur_ou_champ']) || $nk === '4') {
                    $valCol = $k;
                }
            }

            // Fallback if explicit columns not named
            if ($keyCol === null && isset($row['champ'])) {
                $keyCol = 'champ';
            }
            if ($valCol === null && isset($row['valeur'])) {
                $valCol = 'valeur';
            }
            if ($valCol === null && isset($row['4'])) {
                $valCol = '4';
            }

            if ($keyCol && $valCol) {
                $k = $this->normalize((string) $row[$keyCol]);
                $v = trim((string) $row[$valCol]);
                if ($k !== '' && $v !== '') {
                    $kv[$k] = $v;
                }
            } else {
                // Also support traditional header format on a single row
                foreach ([
                    'nom_du_navire' => 'nom du navire',
                    'nom-navire' => 'nom du navire',
                    'vessel_name' => 'vessel name',
                    'vessel-name' => 'vessel name',
                    'numero_imo' => 'numero imo',
                    'imo_no' => 'imo no',
                    'imo' => 'imo',
                    'pavillon' => 'pavillon',
                    'flag' => 'flag',
                    'agent_maritime' => 'agent maritime',
                    'vessel_agent' => 'vessel agent',
                    'port_de_provenance' => 'port de provenance',
                    'origin_port' => 'origin port',
                    'eta' => 'eta',
                    'estimated_arrival' => 'estimated arrival',
                    // total vehicles count variants
                    'nombre_total_de_vehicules' => 'nombre total de vehicules',
                    'nombre_total_vehicules' => 'nombre total de vehicules',
                    'vehicules_total' => 'nombre total de vehicules',
                    'total_vehicules' => 'nombre total de vehicules',
                    'total_vehicles' => 'nombre total de vehicules',
                    'vehicles_total' => 'nombre total de vehicules',
                    'vehicles_number' => 'nombre total de vehicules',
                    'nb_vehicules' => 'nombre total de vehicules',
                    'nb-vehicules' => 'nombre total de vehicules',
                    'nbre_vehicules' => 'nombre total de vehicules',
                    'nb_vehicles' => 'nombre total de vehicules',
                ] as $rawKey => $alias) {
                    if (isset($row[$rawKey])) {
                        $kv[$alias] = trim((string) $row[$rawKey]);
                    }
                }
            }
        }

        try {
            $nomNavire = (string) ($this->getKvVal($kv, ['nom du navire', 'vessel name', 'vessel_name']) ?? '');
            $imo = (string) ($this->getKvVal($kv, ['numero imo', 'num ero imo', 'n imo', 'no imo', 'imo no', 'imo']) ?? '');
            $pavillon = (string) ($this->getKvVal($kv, ['pavillon', 'flag']) ?? '');
            $agent = (string) ($this->getKvVal($kv, ['agent maritime', 'vessel agent', 'agent']) ?? '');
            $provenance = (string) ($this->getKvVal($kv, ['port de provenance', 'origin port', 'provenance', 'port d origine']) ?? '');
            $etaRaw = (string) ($this->getKvVal($kv, ['eta', 'estimated arrival']) ?? '');
            $vehiclesTotalRaw = $this->getKvVal($kv, ['nombre total de vehicules', 'total vehicles', 'vehicles total', 'vehicles number', 'total vehicules', 'nb vehicules', 'nbre vehicules']);

            if ($imo === '' || $nomNavire === '' || $pavillon === '' || $agent === '' || $provenance === '' || $etaRaw === '') {
                // If nothing usable found, skip silently to let vehicles trigger explicit error if needed
                Log::warning('Feuille Navire incomplète ou en-têtes non reconnues', ['kv_keys' => array_keys($kv)]);

                return;
            }

            // Find or create vessel by IMO
            $vessel = Vessel::where('imo_no', $imo)->first();
            if (! $vessel) {
                $vessel = Vessel::create([
                    'imo_no' => $imo,
                    'vessel_name' => $nomNavire,
                    'flag' => $pavillon,
                ]);
                $this->ctx->importedVessels++;
                Log::info("Vessel created from manifest: {$imo} - {$nomNavire}");
            }

            $this->ctx->vessel = $vessel;

            // Create a port call for this vessel (dock_id must be null)
            // Parse ETA: accept datetime strings or Excel date serials
            $eta = null;
            if (is_numeric($etaRaw)) {
                // Excel date serial: days since 1899-12-30
                $eta = Carbon::createFromTimestampUTC(((int) $etaRaw - 25569) * 86400);
            } else {
                try {
                    $eta = Carbon::parse($etaRaw);
                } catch (\Throwable) {
                    $eta = now(); // fallback to non-null to satisfy schema
                }
            }

            $portCall = PortCall::create([
                'vessel_agent' => $agent,
                'origin_port' => $provenance,
                'estimated_arrival' => $eta,
                'arrival_date' => null,
                'estimated_departure' => null,
                'departure_date' => null,
                'vessel_id' => $vessel->getKey(),
                'dock_id' => null,
                'vehicles_number' => $this->parseIntNullable($vehiclesTotalRaw),
            ]);

            $this->ctx->portCall = $portCall;
            $this->ctx->importedPortCalls++;

        } catch (\Throwable $e) {
            $this->ctx->errors[] = 'Navire: '.$e->getMessage();
        }
    }

    private function normalize(string $str): string
    {
        $str = mb_strtolower(trim($str));
        // Remove accents
        $str = iconv('UTF-8', 'ASCII//TRANSLIT', $str) ?: $str;
        // Keep letters, numbers and spaces
        $str = preg_replace('/[^a-z0-9\s]/', ' ', $str);
        $str = preg_replace('/\s+/', ' ', $str);

        return trim($str);
    }

    private function getKvVal(array $kv, array $aliases): ?string
    {
        foreach ($aliases as $alias) {
            $normAlias = $this->normalize($alias);
            $aliasNoSpace = str_replace(' ', '', $normAlias);
            foreach ($kv as $k => $v) {
                $nk = $this->normalize((string) $k);
                if ($nk === $normAlias) {
                    return $v;
                }
                if (str_replace(' ', '', $nk) === $aliasNoSpace) {
                    return $v;
                }
            }
        }

        return null;
    }

    private function parseIntNullable(?string $value): ?int
    {
        if ($value === null) {
            return null;
        }
        $value = trim($value);
        if ($value === '') {
            return null;
        }
        // Allow numbers possibly with spaces or commas
        $digits = preg_replace('/[^0-9]/', '', $value);
        if ($digits === '') {
            return null;
        }

        return (int) $digits;
    }

    public function headingRow(): int
    {
        return 1;
    }
}
