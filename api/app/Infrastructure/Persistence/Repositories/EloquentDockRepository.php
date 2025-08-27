<?php

namespace App\Infrastructure\Persistence\Repositories;

use App\Domain\Dock\Entities\Dock as DomainDock;
use App\Domain\Dock\Repositories\DockRepositoryInterface;
use App\Domain\Dock\ValueObjects\DockId;
use App\Domain\Dock\ValueObjects\DockName;
use App\Domain\Dock\ValueObjects\Location;
use App\Models\Dock as EloquentDock;

final class EloquentDockRepository implements DockRepositoryInterface
{
    public function findById(DockId $dockId): ?DomainDock
    {
        $eloquent = EloquentDock::find($dockId->getValue());
        return $eloquent ? $this->toDomainEntity($eloquent) : null;
    }

    public function findAll(): array
    {
        return EloquentDock::all()->map(fn ($e) => $this->toDomainEntity($e))->toArray();
    }

    public function save(DomainDock $dock): DomainDock
    {
        $eloquent = $dock->getDockId() ? EloquentDock::find($dock->getDockId()->getValue()) : new EloquentDock();
        if (!$eloquent) {
            $eloquent = new EloquentDock();
        }

        $eloquent->dock_name = $dock->getDockName()->getValue();
        $eloquent->location = $dock->getLocation()->getValue();
        $eloquent->save();

        return $this->toDomainEntity($eloquent);
    }

    public function delete(DockId $dockId): bool
    {
        $eloquent = EloquentDock::find($dockId->getValue());
        if (!$eloquent) {
            return false;
        }
        return (bool) $eloquent->delete();
    }

    private function toDomainEntity(EloquentDock $eloquent): DomainDock
    {
        return new DomainDock(
            dockId: new DockId($eloquent->dock_id),
            dockName: new DockName($eloquent->dock_name),
            location: new Location($eloquent->location),
            createdAt: $eloquent->created_at,
            updatedAt: $eloquent->updated_at,
        );
    }
}
