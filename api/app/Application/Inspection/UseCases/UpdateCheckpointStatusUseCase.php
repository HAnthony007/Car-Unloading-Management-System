<?php

namespace App\Application\Inspection\UseCases;

use App\Application\Inspection\DTOs\UpdateCheckpointStatusDTO;
use App\Domain\Inspection\Repositories\InspectionRepositoryInterface;
use App\Domain\Inspection\ValueObjects\CheckpointId;
use App\Domain\Inspection\ValueObjects\CheckpointStatus;

final class UpdateCheckpointStatusUseCase
{
    public function __construct(
        private readonly InspectionRepositoryInterface $repository
    ) {}

    public function execute(UpdateCheckpointStatusDTO $dto): array
    {
        $checkpoint = $this->repository->findCheckpointById(new CheckpointId($dto->checkpointId));

        if (! $checkpoint) {
            throw new \RuntimeException('Checkpoint not found');
        }

        $status = CheckpointStatus::from($dto->status);
        $checkpoint->updateStatus($status);

        $this->repository->saveCheckpoint($checkpoint);

        return [
            'checkpoint_id' => $checkpoint->getCheckpointId()->getValue(),
            'status' => $checkpoint->getStatus()->getValue(),
            'updated_at' => $checkpoint->getUpdatedAt()?->toISOString(),
        ];
    }
}
