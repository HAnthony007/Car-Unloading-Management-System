<?php

namespace App\Application\PortCall\UseCases;

use App\Domain\PortCall\ValueObjects\PortCallId;
use App\Domain\Vehicle\Repositories\VehicleRepositoryInterface;

final class GetPortCallVehiclesUseCase
{
    public function __construct(private readonly VehicleRepositoryInterface $vehicleRepository) {}

    /**
     * @return array<int, \App\Domain\Vehicle\Entities\Vehicle>
     */
    public function execute(int $portCallId): array
    {
        return $this->vehicleRepository->findByPortCallId(new PortCallId($portCallId));
    }
}
