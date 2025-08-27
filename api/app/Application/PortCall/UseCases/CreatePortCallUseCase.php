<?php

namespace App\Application\PortCall\UseCases;

use App\Application\PortCall\DTOs\CreatePortCallDTO;
use App\Domain\Dock\ValueObjects\DockId;
use App\Domain\PortCall\Entities\PortCall;
use App\Domain\PortCall\Repositories\PortCallRepositoryInterface;
use App\Domain\PortCall\ValueObjects\DateTimeValue;
use App\Domain\PortCall\ValueObjects\OriginPort;
use App\Domain\PortCall\ValueObjects\VesselAgent;
use App\Domain\Vessel\ValueObjects\VesselId;
use Carbon\Carbon;

final class CreatePortCallUseCase
{
    public function __construct(private readonly PortCallRepositoryInterface $repository) {}

    public function execute(CreatePortCallDTO $dto): PortCall
    {
        $entity = new PortCall(
            portCallId: null,
            vesselAgent: new VesselAgent($dto->vesselAgent),
            originPort: new OriginPort($dto->originPort),
            estimatedArrival: new DateTimeValue($dto->estimatedArrival ? Carbon::parse($dto->estimatedArrival) : null),
            arrivalDate: new DateTimeValue(Carbon::parse($dto->arrivalDate)),
            estimatedDeparture: new DateTimeValue($dto->estimatedDeparture ? Carbon::parse($dto->estimatedDeparture) : null),
            departureDate: new DateTimeValue($dto->departureDate ? Carbon::parse($dto->departureDate) : null),
            vesselId: new VesselId($dto->vesselId),
            dockId: new DockId($dto->dockId),
        );

        return $this->repository->save($entity);
    }
}
