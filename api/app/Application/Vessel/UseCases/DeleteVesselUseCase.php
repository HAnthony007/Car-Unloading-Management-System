<?php

namespace App\Application\Vessel\UseCases;

use App\Domain\Vessel\Repositories\VesselRepositoryInterface;
use App\Domain\Vessel\ValueObjects\VesselId;

final class DeleteVesselUseCase
{
    public function __construct(private readonly VesselRepositoryInterface $repository) {}

    public function execute(int $id): void
    {
        $deleted = $this->repository->delete(new VesselId($id));
        if (! $deleted) {
            throw new \RuntimeException('Vessel not found.');
        }
    }
}
