<?php

namespace App\Application\Movement\UseCases;

use App\Application\Movement\DTOs\MovementSearchCriteriaDTO;
use App\Domain\Movement\Repositories\MovementRepositoryInterface;

final class SearchMovementsUseCase
{
    public function __construct(private readonly MovementRepositoryInterface $repository) {}

    public function execute(MovementSearchCriteriaDTO $criteria): array
    {
        return $this->repository->search(
            dischargeId: $criteria->dischargeId,
            userId: $criteria->userId,
            from: $criteria->from,
            to: $criteria->to,
            note: $criteria->note,
            page: $criteria->page,
            perPage: $criteria->perPage,
        );
    }
}
