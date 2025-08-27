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

        if ($criteria->result) {
            $res = strtoupper($criteria->result);
            $items = array_filter($items, fn ($e) => $e->getResult()->getValue() === $res);
        }
        if ($criteria->userId) {
            $uid = $criteria->userId;
            $items = array_filter($items, fn ($e) => $e->getUserId()->getValue() === $uid);
        }
        if ($criteria->followUpFileId) {
            $fid = $criteria->followUpFileId;
            $items = array_filter($items, fn ($e) => $e->getFollowUpFileId()->getValue() === $fid);
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
