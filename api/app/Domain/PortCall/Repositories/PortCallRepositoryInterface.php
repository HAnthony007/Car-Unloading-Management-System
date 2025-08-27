<?php

namespace App\Domain\PortCall\Repositories;

use App\Domain\PortCall\Entities\PortCall;
use App\Domain\PortCall\ValueObjects\PortCallId;

interface PortCallRepositoryInterface
{
    public function findById(PortCallId $portCallId): ?PortCall;

    /**
     * @return array<int, PortCall>
     */
    public function findAll(): array;

    public function save(PortCall $portCall): PortCall;

    public function delete(PortCallId $portCallId): bool;
}
