<?php

namespace App\Application\Movement\UseCases;

use App\Domain\Movement\Repositories\MovementRepositoryInterface;
use App\Domain\Movement\ValueObjects\MovementId;

final class DeleteMovementUseCase
{
    public function __construct(private readonly MovementRepositoryInterface $repository) {}

    public function execute(int $id): bool
    {
        return $this->repository->delete(new MovementId($id));
    }
}
