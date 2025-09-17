<?php

namespace App\Application\Inspection\UseCases;

use App\Application\Inspection\DTOs\RemoveCheckpointPhotoDTO;
use App\Domain\Inspection\Repositories\InspectionRepositoryInterface;
use App\Domain\Inspection\ValueObjects\CheckpointId;
use App\Domain\Storage\Repositories\FileStorageRepositoryInterface;

final class RemoveCheckpointPhotoUseCase
{
    public function __construct(
        private readonly InspectionRepositoryInterface $repository,
        private readonly FileStorageRepositoryInterface $fileStorage
    ) {}

    public function execute(RemoveCheckpointPhotoDTO $dto): array
    {
        $checkpoint = $this->repository->findCheckpointById(new CheckpointId($dto->checkpointId));

        if (! $checkpoint) {
            throw new \RuntimeException('Checkpoint not found');
        }

        $photos = $checkpoint->getPhotos();
        if (! isset($photos[$dto->photoIndex])) {
            throw new \RuntimeException('Photo not found');
        }

        $photoUrl = $photos[$dto->photoIndex];
        $checkpoint->removePhoto($dto->photoIndex);

        // Delete photo from storage
        $this->fileStorage->deleteFile($photoUrl);

        $this->repository->saveCheckpoint($checkpoint);

        return [
            'checkpoint_id' => $checkpoint->getCheckpointId()->getValue(),
            'photos' => $checkpoint->getPhotos(),
            'updated_at' => $checkpoint->getUpdatedAt()?->toISOString(),
        ];
    }
}
