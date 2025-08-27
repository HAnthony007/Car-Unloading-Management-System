<?php

namespace App\Application\SurveyCheckpoint\UseCases;

use App\Application\SurveyCheckpoint\DTOs\SurveyCheckpointSearchCriteriaDTO;
use App\Domain\Survey\ValueObjects\SurveyId;
use App\Domain\SurveyCheckpoint\Repositories\SurveyCheckpointRepositoryInterface;

final class SearchSurveyCheckpointsUseCase
{
    public function __construct(private readonly SurveyCheckpointRepositoryInterface $repository) {}

    public function execute(SurveyCheckpointSearchCriteriaDTO $criteria): array
    {
        $items = $criteria->surveyId
            ? $this->repository->findBySurveyId(new SurveyId($criteria->surveyId))
            : $this->repository->findAll();

        if ($criteria->title) {
            $needle = mb_strtolower($criteria->title);
            $items = array_filter($items, fn ($c) => str_contains(mb_strtolower($c->getTitle()->getValue()), $needle));
        }

        $items = array_values($items);

        $total = count($items);
        $perPage = max(1, $criteria->perPage);
        $current = max(1, $criteria->page);
        $last = (int) ceil($total / $perPage);
        $offset = ($current - 1) * $perPage;
        $pageData = array_slice($items, $offset, $perPage);

        return [
            'data' => $pageData,
            'current_page' => $current,
            'from' => $total === 0 ? 0 : $offset + 1,
            'last_page' => $last,
            'path' => request()->url(),
            'per_page' => $perPage,
            'to' => min($offset + $perPage, $total),
            'total' => $total,
        ];
    }
}
