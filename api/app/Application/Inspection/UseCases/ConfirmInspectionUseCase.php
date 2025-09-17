<?php

namespace App\Application\Inspection\UseCases;

use App\Application\Inspection\DTOs\ConfirmInspectionDTO;
use App\Domain\Inspection\Repositories\InspectionRepositoryInterface;
use App\Domain\Inspection\ValueObjects\InspectionId;
use App\Domain\Inspection\ValueObjects\InspectionStatus;

final class ConfirmInspectionUseCase
{
    public function __construct(
        private readonly InspectionRepositoryInterface $repository
    ) {}

    public function execute(ConfirmInspectionDTO $dto): array
    {
        $inspection = $this->repository->findById(new InspectionId($dto->inspectionId));

        if (! $inspection) {
            throw new \RuntimeException('Inspection not found');
        }

        // Check if all checkpoints are completed
        $checkpoints = $inspection->getCheckpoints();
        $incompleteCheckpoints = array_filter($checkpoints, fn ($cp) => $cp->getStatus()->getValue() === 'pending');

        if (! empty($incompleteCheckpoints)) {
            throw new \RuntimeException('All checkpoints must be completed before confirming the inspection');
        }

    $inspection->updateStatus(InspectionStatus::COMPLETED);
    // Persist the completed status on the survey
    $this->repository->save($inspection);

        return [
            'inspection_id' => $inspection->getInspectionId()?->getValue(),
            'status' => $inspection->getOverallStatus()->getValue(),
            'completed_at' => $inspection->getUpdatedAt()?->toISOString(),
        ];
    }
}
