<?php

namespace App\Domain\Dock\Repositories;

use App\Domain\Dock\Entities\Dock;
use App\Domain\Dock\ValueObjects\DockId;

interface DockRepositoryInterface
{
    public function findById(DockId $dockId): ?Dock;

    /**
     * @return array<int, Dock>
     */
    public function findAll(): array;

    public function save(Dock $dock): Dock;

    public function delete(DockId $dockId): bool;
}
