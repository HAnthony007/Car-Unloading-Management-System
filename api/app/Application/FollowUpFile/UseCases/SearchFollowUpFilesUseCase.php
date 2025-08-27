<?php

namespace App\Application\FollowUpFile\UseCases;

use App\Application\FollowUpFile\DTOs\FollowUpFileSearchCriteriaDTO;
use App\Domain\FollowUpFile\Repositories\FollowUpFileRepositoryInterface;

final class SearchFollowUpFilesUseCase
{
    public function __construct(private readonly FollowUpFileRepositoryInterface $repository) {}

    public function execute(FollowUpFileSearchCriteriaDTO $criteria): array
    {
        // For now, fetch all and filter in-memory like SearchUsersUseCase. Can be optimized later.
        $items = $this->repository->findAll();

        if ($criteria->billOfLading) {
            $needle = strtoupper($criteria->billOfLading);
            $items = array_filter($items, fn ($e) => str_contains($e->getBillOfLading()->getValue(), $needle));
        }
        if ($criteria->status) {
            $status = strtoupper($criteria->status);
            $items = array_filter($items, fn ($e) => $e->getStatus()->getValue() === $status);
        }
        if ($criteria->vehicleId) {
            $vid = $criteria->vehicleId;
            $items = array_filter($items, fn ($e) => $e->getVehicleId()->getValue() === $vid);
        }
        if ($criteria->portCallId) {
            $pid = $criteria->portCallId;
            $items = array_filter($items, fn ($e) => $e->getPortCallId()->getValue() === $pid);
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
