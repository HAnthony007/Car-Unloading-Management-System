<?php

namespace App\Application\Vessel\UseCases;

use App\Domain\Vessel\Entities\Vessel;
use App\Domain\Vessel\Repositories\VesselRepositoryInterface;
use App\Domain\Vessel\ValueObjects\VesselId;

final class GetVesselUseCase
{
    public function __construct(private readonly VesselRepositoryInterface $repository) {}

    public function execute(int $id): Vessel
    {
        $vessel = $this->repository->findById(new VesselId($id));
        if (! $vessel) {
            throw new \RuntimeException('Vessel not found.');
        }

        return $vessel;
    }
}
