<?php

namespace App\Application\Discharge\UseCases;

use App\Domain\Discharge\Entities\Discharge;
use App\Domain\Discharge\Repositories\DischargeRepositoryInterface;
use App\Domain\Discharge\ValueObjects\DischargeId;

final class GetDischargeUseCase
{
    public function __construct(private readonly DischargeRepositoryInterface $repository) {}

    public function execute(int $id): Discharge
    {
        $found = $this->repository->findById(new DischargeId($id));
        if (! $found) {
            throw new \RuntimeException('Discharge not found');
        }

        return $found;
    }
}
