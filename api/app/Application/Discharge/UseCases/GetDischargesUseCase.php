<?php

namespace App\Application\Discharge\UseCases;

use App\Domain\Discharge\Entities\Discharge;
use App\Domain\Discharge\Repositories\DischargeRepositoryInterface;

final class GetDischargesUseCase
{
    public function __construct(private readonly DischargeRepositoryInterface $repository) {}

    /** @return array<int, Discharge> */
    public function execute(): array
    {
        return $this->repository->findAll();
    }
}
