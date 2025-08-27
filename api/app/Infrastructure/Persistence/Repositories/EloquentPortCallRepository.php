<?php

namespace App\Infrastructure\Persistence\Repositories;

use App\Domain\Dock\ValueObjects\DockId;
use App\Domain\PortCall\Entities\PortCall as DomainPortCall;
use App\Domain\PortCall\Repositories\PortCallRepositoryInterface;
use App\Domain\PortCall\ValueObjects\DateTimeValue;
use App\Domain\PortCall\ValueObjects\OriginPort;
use App\Domain\PortCall\ValueObjects\PortCallId;
use App\Domain\PortCall\ValueObjects\VesselAgent;
use App\Domain\Vessel\ValueObjects\VesselId;
use App\Models\PortCall as EloquentPortCall;
use Carbon\Carbon;

final class EloquentPortCallRepository implements PortCallRepositoryInterface
{
    public function findById(PortCallId $portCallId): ?DomainPortCall
    {
        $eloquent = EloquentPortCall::find($portCallId->getValue());

        return $eloquent ? $this->toDomainEntity($eloquent) : null;
    }

    public function findAll(): array
    {
        return EloquentPortCall::orderByDesc('arrival_date')->get()->map(fn ($e) => $this->toDomainEntity($e))->toArray();
    }

    public function save(DomainPortCall $portCall): DomainPortCall
    {
        $eloquent = $portCall->getPortCallId() ? EloquentPortCall::find($portCall->getPortCallId()->getValue()) : new EloquentPortCall;
        if (! $eloquent) {
            $eloquent = new EloquentPortCall;
        }

        $eloquent->vessel_agent = $portCall->getVesselAgent()->getValue();
        $eloquent->origin_port = $portCall->getOriginPort()->getValue();
        $eloquent->estimated_arrival = $portCall->getEstimatedArrival()->getValue();
        $eloquent->arrival_date = $portCall->getArrivalDate()->getValue();
        $eloquent->estimated_departure = $portCall->getEstimatedDeparture()->getValue();
        $eloquent->departure_date = $portCall->getDepartureDate()->getValue();
        $eloquent->vessel_id = $portCall->getVesselId()->getValue();
        $eloquent->dock_id = $portCall->getDockId()->getValue();
        $eloquent->save();

        return $this->toDomainEntity($eloquent);
    }

    public function delete(PortCallId $portCallId): bool
    {
        $eloquent = EloquentPortCall::find($portCallId->getValue());
        if (! $eloquent) {
            return false;
        }

        return (bool) $eloquent->delete();
    }

    private function toDomainEntity(EloquentPortCall $e): DomainPortCall
    {
        return new DomainPortCall(
            portCallId: new PortCallId($e->port_call_id),
            vesselAgent: new VesselAgent($e->vessel_agent),
            originPort: new OriginPort($e->origin_port),
            estimatedArrival: new DateTimeValue($e->estimated_arrival ? Carbon::parse($e->estimated_arrival) : null),
            arrivalDate: new DateTimeValue($e->arrival_date ? Carbon::parse($e->arrival_date) : null),
            estimatedDeparture: new DateTimeValue($e->estimated_departure ? Carbon::parse($e->estimated_departure) : null),
            departureDate: new DateTimeValue($e->departure_date ? Carbon::parse($e->departure_date) : null),
            vesselId: new VesselId($e->vessel_id),
            dockId: new DockId($e->dock_id),
            createdAt: $e->created_at,
            updatedAt: $e->updated_at,
        );
    }
}
