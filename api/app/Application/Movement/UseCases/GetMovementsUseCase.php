<?php

namespace App\Application\Movement\UseCases;

use App\Domain\Movement\Entities\Movement as DomainMovement;
use App\Domain\Movement\Repositories\MovementRepositoryInterface;

final class GetMovementsUseCase
{
    public function __construct(private readonly MovementRepositoryInterface $repository) {}

    /** @return array<int, DomainMovement> */
    public function execute(): array
    {
        return $this->repository->findAll();
    }
}
