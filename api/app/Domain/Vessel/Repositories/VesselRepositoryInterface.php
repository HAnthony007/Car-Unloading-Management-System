<?php

namespace App\Domain\Vessel\Repositories;

use App\Domain\Vessel\Entities\Vessel;
use App\Domain\Vessel\ValueObjects\VesselId;

interface VesselRepositoryInterface
{
    public function findById(VesselId $vesselId): ?Vessel;

    /**
     * @return array<int, Vessel>
     */
    public function findAll(): array;

    public function save(Vessel $vessel): Vessel;

    public function delete(VesselId $vesselId): bool;
}
