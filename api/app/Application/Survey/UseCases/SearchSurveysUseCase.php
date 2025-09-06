<?php

namespace App\Application\Survey\UseCases;

use App\Application\Survey\DTOs\SurveySearchCriteriaDTO;
use App\Domain\Survey\Repositories\SurveyRepositoryInterface;

final class SearchSurveysUseCase
{
    public function __construct(private readonly SurveyRepositoryInterface $repository) {}

    public function execute(SurveySearchCriteriaDTO $criteria): array
    {
        $items = $this->repository->findAll();

        if ($criteria->overallStatus) {
            $st = strtoupper($criteria->overallStatus);
            $items = array_filter($items, fn ($e) => $e->getOverallStatus()->getValue() === $st);
        }
        if ($criteria->agentId) {
            $aid = $criteria->agentId;
            $items = array_filter($items, fn ($e) => $e->getAgentId()->getValue() === $aid);
        }
        if ($criteria->dischargeId) {
            $did = $criteria->dischargeId;
            $items = array_filter($items, fn ($e) => $e->getDischargeId()->getValue() === $did);
        }

        $items = array_values($items);

        $total = count($items);
        $perPage = $criteria->perPage;
        $current = $criteria->page;
        $last = (int) ceil($total / $perPage);
        $offset = ($current - 1) * $perPage;
        $pageData = array_slice($items, $offset, $perPage);

        return [
            'data' => $pageData,
            'current_page' => $current,
            'from' => $offset + 1,
            'last_page' => $last,
            'path' => request()->url(),
            'per_page' => $perPage,
            'to' => min($offset + $perPage, $total),
            'total' => $total,
        ];
    }
}
