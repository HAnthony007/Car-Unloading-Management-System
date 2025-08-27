<?php

namespace App\Application\PortCall\UseCases;

use App\Application\PortCall\DTOs\UpdatePortCallDTO;
use App\Domain\Dock\ValueObjects\DockId;
use App\Domain\PortCall\Entities\PortCall;
use App\Domain\PortCall\Repositories\PortCallRepositoryInterface;
use App\Domain\PortCall\ValueObjects\DateTimeValue;
use App\Domain\PortCall\ValueObjects\OriginPort;
use App\Domain\PortCall\ValueObjects\PortCallId;
use App\Domain\PortCall\ValueObjects\VesselAgent;
use App\Domain\Vessel\ValueObjects\VesselId;
use Carbon\Carbon;

final class UpdatePortCallUseCase
{
    public function __construct(private readonly PortCallRepositoryInterface $repository) {}

    public function execute(UpdatePortCallDTO $dto): PortCall
    {
        $existing = $this->repository->findById(new PortCallId($dto->portCallId));
        if (!$existing) {
            throw new \RuntimeException('Port call not found');
        }

        $entity = new PortCall(
            portCallId: $existing->getPortCallId(),
            vesselAgent: $dto->vesselAgent !== null ? new VesselAgent($dto->vesselAgent) : $existing->getVesselAgent(),
            originPort: $dto->originPort !== null ? new OriginPort($dto->originPort) : $existing->getOriginPort(),
            estimatedArrival: $dto->estimatedArrival !== null ? new DateTimeValue($dto->estimatedArrival ? Carbon::parse($dto->estimatedArrival) : null) : $existing->getEstimatedArrival(),
            arrivalDate: $dto->arrivalDate !== null ? new DateTimeValue($dto->arrivalDate ? Carbon::parse($dto->arrivalDate) : null) : $existing->getArrivalDate(),
            estimatedDeparture: $dto->estimatedDeparture !== null ? new DateTimeValue($dto->estimatedDeparture ? Carbon::parse($dto->estimatedDeparture) : null) : $existing->getEstimatedDeparture(),
            departureDate: $dto->departureDate !== null ? new DateTimeValue($dto->departureDate ? Carbon::parse($dto->departureDate) : null) : $existing->getDepartureDate(),
            vesselId: $dto->vesselId !== null ? new VesselId($dto->vesselId) : $existing->getVesselId(),
            dockId: $dto->dockId !== null ? new DockId($dto->dockId) : $existing->getDockId(),
            createdAt: $existing->getCreatedAt(),
            updatedAt: now(),
        );

        return $this->repository->save($entity);
    }
}
