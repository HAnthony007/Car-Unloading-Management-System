<?php

namespace App\Infrastructure\Persistence\Repositories;

use App\Domain\Vessel\Entities\Vessel as DomainVessel;
use App\Domain\Vessel\Repositories\VesselRepositoryInterface;
use App\Domain\Vessel\ValueObjects\Flag;
use App\Domain\Vessel\ValueObjects\ImoNumber;
use App\Domain\Vessel\ValueObjects\VesselId;
use App\Domain\Vessel\ValueObjects\VesselName as VesselNameVO;
use App\Models\Vessel as EloquentVessel;

final class EloquentVesselRepository implements VesselRepositoryInterface
{
    public function findById(VesselId $vesselId): ?DomainVessel
    {
        $eloquent = EloquentVessel::find($vesselId->getValue());
        return $eloquent ? $this->toDomainEntity($eloquent) : null;
    }

    public function findAll(): array
    {
        return EloquentVessel::all()->map(fn ($e) => $this->toDomainEntity($e))->toArray();
    }

    public function save(DomainVessel $vessel): DomainVessel
    {
        $eloquent = $vessel->getVesselId() ? EloquentVessel::find($vessel->getVesselId()->getValue()) : new EloquentVessel();
        if (!$eloquent) {
            $eloquent = new EloquentVessel();
        }

        $eloquent->imo_no = $vessel->getImoNumber()->getValue();
        $eloquent->vessel_name = $vessel->getVesselName()->getValue();
        $eloquent->flag = $vessel->getFlag()->getValue();
        $eloquent->save();

        return $this->toDomainEntity($eloquent);
    }

    public function delete(VesselId $vesselId): bool
    {
        $eloquent = EloquentVessel::find($vesselId->getValue());
        if (!$eloquent) {
            return false;
        }
        return (bool) $eloquent->delete();
    }

    private function toDomainEntity(EloquentVessel $eloquent): DomainVessel
    {
        return new DomainVessel(
            vesselId: new VesselId($eloquent->vessel_id),
            imoNumber: new ImoNumber($eloquent->imo_no),
            vesselName: new VesselNameVO($eloquent->vessel_name),
            flag: new Flag($eloquent->flag),
            createdAt: $eloquent->created_at,
            updatedAt: $eloquent->updated_at,
        );
    }
}
