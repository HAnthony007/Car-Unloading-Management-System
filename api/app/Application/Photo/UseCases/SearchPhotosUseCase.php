<?php

namespace App\Application\Photo\UseCases;

use App\Application\Photo\DTOs\PhotoSearchCriteriaDTO;
use App\Domain\Photo\Repositories\PhotoRepositoryInterface;

final class SearchPhotosUseCase
{
    public function __construct(private readonly PhotoRepositoryInterface $repo) {}

    public function execute(PhotoSearchCriteriaDTO $criteria): array
    {
        return $this->repo->search(
            followUpFileId: $criteria->followUpFileId,
            checkpointId: $criteria->checkpointId,
            fromDate: $criteria->fromDate,
            toDate: $criteria->toDate,
            page: $criteria->page,
            perPage: $criteria->perPage,
        );
    }
}
