<?php

namespace App\Application\Parking\UseCases;

use App\Domain\Discharge\Repositories\DischargeRepositoryInterface;
use App\Domain\Movement\Repositories\MovementRepositoryInterface;
use App\Domain\Parking\Repositories\ParkingRepositoryInterface;
use App\Domain\Parking\ValueObjects\ParkingId;
use App\Domain\Vehicle\Repositories\VehicleRepositoryInterface;

final class GetParkingDischargesUseCase
{
    public function __construct(
        private readonly ParkingRepositoryInterface $parkingRepository,
        private readonly MovementRepositoryInterface $movementRepository,
        private readonly DischargeRepositoryInterface $dischargeRepository,
        private readonly VehicleRepositoryInterface $vehicleRepository,
    ) {}

    /**
     * @return array{parking_id:int, parking_name:string, total:int, discharges: array<int, array<string,mixed>>, parking_numbers: array<int,string|null>}
     */
    public function execute(int $parkingId): array
    {
        $parking = $this->parkingRepository->findById(new ParkingId($parkingId));
        if (! $parking) {
            throw new \RuntimeException('Parking not found');
        }

        $locationName = $parking->getParkingName()->getValue();

        // Dernier mouvement par discharge à cet emplacement
        $dischargeIds = $this->movementRepository->findDischargeIdsAtLocation($locationName);
        $parkingNumbers = $this->movementRepository->findLatestParkingNumbersForDischargesAtLocation($locationName);

        $discharges = [];
        foreach ($dischargeIds as $did) {
            $d = $this->dischargeRepository->findById(new \App\Domain\Discharge\ValueObjects\DischargeId($did));
            if (! $d) {
                continue;
            }
            $discharges[] = [
                'discharge_id' => $d->getDischargeId()?->getValue(),
                'discharge_date' => $d->getDischargeDate()->getValue()?->toIso8601String(),
                'port_call_id' => $d->getPortCallId()->getValue(),
                'parking_number' => $parkingNumbers[$did] ?? null,
            ];
        }

        return [
            'parking_id' => $parking->getParkingId()?->getValue() ?? $parkingId,
            'parking_name' => $locationName,
            'total' => count($discharges),
            'discharges' => $discharges,
            'parking_numbers' => $parkingNumbers,
        ];
    }
}
