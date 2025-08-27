<?php

namespace App\Infrastructure\Persistence\Repositories;

use App\Domain\Discharge\Entities\Discharge as DomainDischarge;
use App\Domain\Discharge\Repositories\DischargeRepositoryInterface;
use App\Domain\Discharge\ValueObjects\DateTimeValue;
use App\Domain\Discharge\ValueObjects\DischargeId;
use App\Domain\PortCall\ValueObjects\PortCallId;
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
        return EloquentDischarge::orderByDesc('discharge_date')->get()->map(fn ($e) => $this->toDomainEntity($e))->toArray();
    }

    public function findByPortCallId(PortCallId $portCallId): array
    {
        return EloquentDischarge::where('port_call_id', $portCallId->getValue())
            ->orderByDesc('discharge_date')
            ->get()
            ->map(fn ($e) => $this->toDomainEntity($e))
            ->toArray();
    }

    public function save(DomainDischarge $discharge): DomainDischarge
    {
        $eloquent = $discharge->getDischargeId() ? EloquentDischarge::find($discharge->getDischargeId()->getValue()) : new EloquentDischarge();
        if (!$eloquent) {
            $eloquent = new EloquentDischarge();
        }

        $eloquent->discharge_date = $discharge->getDischargeDate()->getValue();
        $eloquent->port_call_id = $discharge->getPortCallId()->getValue();
        $eloquent->save();

        return $this->toDomainEntity($eloquent);
    }

    public function delete(DischargeId $id): bool
    {
        $eloquent = EloquentDischarge::find($id->getValue());
        if (!$eloquent) {
            return false;
        }
        return (bool) $eloquent->delete();
    }

    private function toDomainEntity(EloquentDischarge $e): DomainDischarge
    {
        return new DomainDischarge(
            dischargeId: new DischargeId($e->discharge_id),
            dischargeDate: new DateTimeValue($e->discharge_date ? Carbon::parse($e->discharge_date) : null),
            portCallId: new PortCallId($e->port_call_id),
            createdAt: $e->created_at,
            updatedAt: $e->updated_at,
        );
    }
}