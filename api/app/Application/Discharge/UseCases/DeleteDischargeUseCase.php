<?php

namespace App\Application\Discharge\UseCases;

use App\Domain\Discharge\Repositories\DischargeRepositoryInterface;
use App\Domain\Discharge\ValueObjects\DischargeId;

final class DeleteDischargeUseCase
{
    public function __construct(private readonly DischargeRepositoryInterface $repository) {}

    public function execute(int $id): void
    {
        $deleted = $this->repository->delete(new DischargeId($id));
        if (! $deleted) {
            throw new \RuntimeException('Discharge not found');
        }
    }
}
