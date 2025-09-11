<?php

namespace App\Infrastructure\Persistence\Repositories;

use App\Domain\Discharge\Entities\Discharge as DomainDischarge;
use App\Domain\Discharge\Repositories\DischargeRepositoryInterface;
use App\Domain\Discharge\ValueObjects\DateTimeValue;
use App\Domain\Discharge\ValueObjects\DischargeId;
use App\Domain\PortCall\ValueObjects\PortCallId;
use App\Domain\Vehicle\ValueObjects\VehicleId;
use App\Domain\User\ValueObjects\UserId;
use App\Models\Discharge as EloquentDischarge;
use Carbon\Carbon;

final class EloquentDischargeRepository implements DischargeRepositoryInterface
{
    public function findById(DischargeId $id): ?DomainDischarge
    {
        $eloquent = EloquentDischarge::find($id->getValue());

        return $eloquent ? $this->toDomainEntity($eloquent) : null;
    }

    public function findAll(): array
    {
        return EloquentDischarge::with(['portCall.vessel', 'portCall.dock', 'vehicle', 'agent'])
            ->orderByDesc('discharge_timestamp')
            ->get()
            ->map(fn ($e) => $this->toDomainEntity($e))
            ->toArray();
    }

    public function findByPortCallId(PortCallId $portCallId): array
    {
        return EloquentDischarge::with(['portCall.vessel', 'portCall.dock', 'vehicle', 'agent'])
            ->where('port_call_id', $portCallId->getValue())
            ->orderByDesc('discharge_timestamp')
            ->get()
            ->map(fn ($e) => $this->toDomainEntity($e))
            ->toArray();
    }

    public function findLatestByVehicleAndPortCall(VehicleId $vehicleId, PortCallId $portCallId): ?DomainDischarge
    {
        $eloquent = EloquentDischarge::with(['portCall.vessel', 'portCall.dock', 'vehicle', 'agent'])
            ->where('vehicle_id', $vehicleId->getValue())
            ->where('port_call_id', $portCallId->getValue())
            ->orderByDesc('discharge_timestamp')
            ->first();
        return $eloquent ? $this->toDomainEntity($eloquent) : null;
    }

    public function save(DomainDischarge $discharge): DomainDischarge
    {
        $eloquent = $discharge->getDischargeId() ? EloquentDischarge::find($discharge->getDischargeId()->getValue()) : new EloquentDischarge;
        if (! $eloquent) {
            $eloquent = new EloquentDischarge;
        }

        $eloquent->discharge_timestamp = $discharge->getDischargeDate()->getValue();
        $eloquent->port_call_id = $discharge->getPortCallId()->getValue();
    $eloquent->vehicle_id = $discharge->getVehicleId()->getValue();
    $eloquent->agent_id = $discharge->getAgentId()->getValue();
        $eloquent->save();

        return $this->toDomainEntity($eloquent);
    }

    public function delete(DischargeId $id): bool
    {
        $eloquent = EloquentDischarge::find($id->getValue());
        if (! $eloquent) {
            return false;
        }

        return (bool) $eloquent->delete();
    }

    private function toDomainEntity(EloquentDischarge $e): DomainDischarge
    {
        return new DomainDischarge(
            dischargeId: new DischargeId($e->discharge_id),
            dischargeDate: new DateTimeValue($e->discharge_timestamp ? Carbon::parse($e->discharge_timestamp) : null),
            portCallId: new PortCallId($e->port_call_id),
            vehicleId: new VehicleId($e->vehicle_id),
            agentId: new UserId($e->agent_id),
            createdAt: $e->created_at,
            updatedAt: $e->updated_at,
        );
    }
}
