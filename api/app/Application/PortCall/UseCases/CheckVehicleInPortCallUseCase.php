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
        $vinVO = new Vin($rawVin); // normalizes & basic validation
        $vin = $vinVO->getValue();
        $vehicle = $this->vehicleRepository->findByVin($vinVO);
        if (! $vehicle) {
            return new VehiclePortCallCheckResultDTO($vin, false, null, null);
        }

        $vehicleIdObj = $vehicle->getVehicleId();
        if (! $vehicleIdObj) {
            return new VehiclePortCallCheckResultDTO($vin, true, null, null);
        }
        $vehicleId = new VehicleId($vehicleIdObj->getValue());
        $portCallIdVO = new PortCallId($portCallId);
        $discharge = $this->dischargeRepository->findLatestByVehicleAndPortCall($vehicleId, $portCallIdVO);

        return new VehiclePortCallCheckResultDTO(
            $vin,
            true,
            $vehicleIdObj->getValue(),
            $discharge?->getDischargeId()?->getValue(),
        );
    }
}
