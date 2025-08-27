<?php

namespace App\Application\Movement\UseCases;

use App\Domain\Movement\Entities\Movement as DomainMovement;
use App\Domain\Movement\Repositories\MovementRepositoryInterface;
use App\Domain\Movement\ValueObjects\MovementId;

final class GetMovementUseCase
{
    public function __construct(private readonly MovementRepositoryInterface $repository) {}

    public function execute(int $id): DomainMovement
    {
        $movement = $this->repository->findById(new MovementId($id));
        if (! $movement) {
            throw new \RuntimeException('Movement not found.');
        }

        return $movement;
    }
}
