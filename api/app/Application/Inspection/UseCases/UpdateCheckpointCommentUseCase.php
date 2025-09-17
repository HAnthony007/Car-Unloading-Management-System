<?php

namespace App\Application\Inspection\UseCases;

use App\Application\Inspection\DTOs\UpdateCheckpointCommentDTO;
use App\Domain\Inspection\Repositories\InspectionRepositoryInterface;
use App\Domain\Inspection\ValueObjects\CheckpointId;

final class UpdateCheckpointCommentUseCase
{
    public function __construct(
        private readonly InspectionRepositoryInterface $repository
    ) {}

    public function execute(UpdateCheckpointCommentDTO $dto): array
    {
        $checkpoint = $this->repository->findCheckpointById(new CheckpointId($dto->checkpointId));

        if (! $checkpoint) {
            throw new \RuntimeException('Checkpoint not found');
        }

        $checkpoint->updateComment($dto->comment);

        $this->repository->saveCheckpoint($checkpoint);

        return [
            'checkpoint_id' => $checkpoint->getCheckpointId()->getValue(),
            'comment' => $checkpoint->getComment(),
            'updated_at' => $checkpoint->getUpdatedAt()?->toISOString(),
        ];
    }
}
