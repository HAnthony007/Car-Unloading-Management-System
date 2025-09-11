<?php

namespace App\Application\PortCall\UseCases;

use App\Application\PortCall\DTOs\PortCallSearchCriteriaDTO;
use App\Domain\PortCall\Repositories\PortCallRepositoryInterface;

final class SearchPortCallsUseCase
{
    public function __construct(private readonly PortCallRepositoryInterface $repository) {}

    public function execute(PortCallSearchCriteriaDTO $criteria): array
    {
        $portCalls = $this->repository->findAll();

        // Apply filtering in memory for now (consistent with current User search approach).
        if ($criteria->vesselAgent) {
            $needle = strtolower($criteria->vesselAgent);
            $portCalls = array_filter($portCalls, fn ($pc) => str_contains(strtolower($pc->getVesselAgent()->getValue()), $needle));
        }

        if ($criteria->originPort) {
            $needle = strtolower($criteria->originPort);
            $portCalls = array_filter($portCalls, fn ($pc) => str_contains(strtolower($pc->getOriginPort()->getValue()), $needle));
        }

        if ($criteria->status) {
            $needle = strtolower($criteria->status);
            $portCalls = array_filter($portCalls, fn ($pc) => method_exists($pc, 'getStatus') ? strtolower($pc->getStatus()) === $needle : true);
        }

        if ($criteria->searchTerm) {
            $needle = strtolower($criteria->searchTerm);
            $portCalls = array_filter($portCalls, function ($pc) use ($needle) {
                $agent = strtolower($pc->getVesselAgent()->getValue());
                $origin = strtolower($pc->getOriginPort()->getValue());
                return str_contains($agent, $needle) || str_contains($origin, $needle);
            });
        }

        if ($criteria->arrivalFrom || $criteria->arrivalTo) {
            $from = $criteria->arrivalFrom ? strtotime($criteria->arrivalFrom) : null;
            $to = $criteria->arrivalTo ? strtotime($criteria->arrivalTo.' 23:59:59') : null;
            $portCalls = array_filter($portCalls, function ($pc) use ($from, $to) {
                $arrival = $pc->getArrivalDate()->getValue();
                if ($arrival === null) { return false; }
                $ts = strtotime($arrival->toDateTimeString());
                if ($from && $ts < $from) { return false; }
                if ($to && $ts > $to) { return false; }
                return true;
            });
        }

        $portCalls = array_values($portCalls);

        $total = count($portCalls);
        $perPage = $criteria->perPage;
        $currentPage = max(1, $criteria->page);
        $lastPage = (int) ceil($total / $perPage);
        $offset = ($currentPage - 1) * $perPage;
        $paginated = array_slice($portCalls, $offset, $perPage);

        return [
            'data' => $paginated,
            'current_page' => $currentPage,
            'from' => $total === 0 ? 0 : $offset + 1,
            'last_page' => $lastPage,
            'path' => request()->url(),
            'per_page' => $perPage,
            'to' => $total === 0 ? 0 : min($offset + $perPage, $total),
            'total' => $total,
        ];
    }
}
