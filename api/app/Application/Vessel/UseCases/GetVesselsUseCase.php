<?php

namespace App\Application\Vessel\UseCases;

use App\Domain\Vessel\Entities\Vessel;
use App\Domain\Vessel\Repositories\VesselRepositoryInterface;

final class GetVesselsUseCase
{
    public function __construct(private readonly VesselRepositoryInterface $repository) {}

    /**
     * @return array<int, Vessel>
     */
    public function execute(): array
    {
        return $this->repository->findAll();
    }
}
