<?php

namespace App\Domain\Discharge\Repositories;

use App\Domain\Discharge\Entities\Discharge;
use App\Domain\Discharge\ValueObjects\DischargeId;
use App\Domain\PortCall\ValueObjects\PortCallId;

interface DischargeRepositoryInterface
{
    public function findById(DischargeId $id): ?Discharge;

    /** @return array<int, Discharge> */
    public function findAll(): array;

    /** @return array<int, Discharge> */
    public function findByPortCallId(PortCallId $portCallId): array;

    public function save(Discharge $discharge): Discharge;

    public function delete(DischargeId $id): bool;
}
