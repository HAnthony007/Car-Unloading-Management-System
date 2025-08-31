<?php

namespace App\Application\Parking\UseCases;

use App\Domain\Movement\Repositories\MovementRepositoryInterface;
use App\Domain\Parking\Repositories\ParkingRepositoryInterface;
use App\Domain\Parking\ValueObjects\ParkingId;
use App\Domain\Vehicle\Entities\Vehicle;
use App\Domain\Vehicle\Repositories\VehicleRepositoryInterface;

final class GetParkingVehiclesUseCase
{
    public function __construct(
        private readonly ParkingRepositoryInterface $parkingRepository,
        private readonly MovementRepositoryInterface $movementRepository,
        private readonly VehicleRepositoryInterface $vehicleRepository,
    ) {}

    /**
     * @return array{parking_id:int, parking_name:string, total:int, vehicles: array<int, Vehicle>, parking_numbers: array<int, string|null>}
     */
    public function execute(int $parkingId): array
    {
        $parking = $this->parkingRepository->findById(new ParkingId($parkingId));
        if (! $parking) {
            throw new \RuntimeException('Parking not found');
        }

        $locationName = $parking->getParkingName()->getValue();

        $vehicleIds = $this->movementRepository->findVehicleIdsAtLocation($locationName);

        // Map to Domain Vehicles
        $vehicles = [];
        foreach ($vehicleIds as $vid) {
            $v = $this->vehicleRepository->findById(new \App\Domain\Vehicle\ValueObjects\VehicleId($vid));
            if ($v) {
                $vehicles[] = $v;
            }
        }

        $parkingNumbers = $this->movementRepository->findLatestParkingNumbersForVehiclesAtLocation($locationName);

        return [
            'parking_id' => $parking->getParkingId()?->getValue() ?? $parkingId,
            'parking_name' => $locationName,
            'total' => count($vehicles),
            'vehicles' => $vehicles,
            // Map vehicle_id => parking_number (nullable). Only filled for Mahasarika; null elsewhere.
            'parking_numbers' => $parkingNumbers,
        ];
    }
}
