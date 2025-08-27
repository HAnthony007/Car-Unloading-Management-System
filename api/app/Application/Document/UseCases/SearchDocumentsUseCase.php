<?php

namespace App\Application\Document\UseCases;

use App\Application\Document\DTOs\DocumentSearchCriteriaDTO;
use App\Domain\Document\Repositories\DocumentRepositoryInterface;

final class SearchDocumentsUseCase
{
    public function __construct(private readonly DocumentRepositoryInterface $repo) {}

    /** @return array{data: array<int, \App\Domain\Document\Entities\Document>, current_page: int, from: int, last_page: int, path: string, per_page: int, to: int, total: int} */
    public function execute(DocumentSearchCriteriaDTO $criteria): array
    {
        return $this->repo->search(
            followUpFileId: $criteria->followUpFileId,
            type: $criteria->type,
            fromDate: $criteria->fromDate,
            toDate: $criteria->toDate,
            page: $criteria->page,
            perPage: $criteria->perPage,
        );
    }
}
