<?php

namespace App\Application\PortCall\UseCases;

use App\Application\PortCall\DTOs\VehiclePortCallCheckResultDTO;
use App\Domain\Discharge\Repositories\DischargeRepositoryInterface;
use App\Domain\PortCall\ValueObjects\PortCallId;
use App\Domain\Vehicle\Repositories\VehicleRepositoryInterface;
use App\Domain\Vehicle\ValueObjects\VehicleId;
use App\Domain\Vehicle\ValueObjects\Vin;

final class CheckVehicleInPortCallUseCase
{
    public function __construct(
        private readonly VehicleRepositoryInterface $vehicleRepository,
        private readonly DischargeRepositoryInterface $dischargeRepository,
    ) {}

    public function execute(string $rawVin, int $portCallId): VehiclePortCallCheckResultDTO
    {
        // Normalisation + validation basique du VIN via un Value Object
        $vinVO = new Vin($rawVin); // normalizes & basic validation
        $vin = $vinVO->getValue();

        // Recherche du véhicule par VIN
        $vehicle = $this->vehicleRepository->findByVin($vinVO);
        if (! $vehicle) {
            // Véhicule inconnu: on renvoie exists=false et pas d'IDs
            return new VehiclePortCallCheckResultDTO($vin, false, null, null);
        }

        // Récupère l'ID du véhicule s'il est disponible
        $vehicleIdObj = $vehicle->getVehicleId();
        if (! $vehicleIdObj) {
            // Véhicule trouvé mais sans identifiant (cas limite): exists=true, IDs null
            return new VehiclePortCallCheckResultDTO($vin, true, null, null);
        }

        // Construit les Value Objects nécessaires pour la requête domaine
        $vehicleId = new VehicleId($vehicleIdObj->getValue());
        $portCallIdVO = new PortCallId($portCallId);

        // Cherche le dernier déchargement de ce véhicule pour l'escale ciblée
        $discharge = $this->dischargeRepository->findLatestByVehicleAndPortCall($vehicleId, $portCallIdVO);

        // Retourne le résultat avec les identifiants (si disponibles)
        return new VehiclePortCallCheckResultDTO(
            $vin,
            true,
            $vehicleIdObj->getValue(),
            $discharge?->getDischargeId()?->getValue(),
        );
    }
}

/**
 * Vérifie si un véhicule (via son VIN) est présent dans une escale donnée et
 * retourne éventuellement la dernière opération de déchargement associée.
 *
 * Entrées:
 * - $rawVin: VIN tel que saisi (sera normalisé/validé par Vin VO)
 * - $portCallId: identifiant technique de l'escale
 *
 * Sortie: VehiclePortCallCheckResultDTO contenant
 * - vin normalisé
 * - exists: booléen indiquant si le véhicule existe dans le référentiel
     * - vehicleId: identifiant du véhicule (ou null si non disponible)
     * - dischargeId: identifiant du dernier déchargement pour cette escale (ou null)
     */