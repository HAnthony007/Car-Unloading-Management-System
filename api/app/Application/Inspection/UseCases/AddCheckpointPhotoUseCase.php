<?php

namespace App\Application\Inspection\UseCases;

use App\Application\Inspection\DTOs\AddCheckpointPhotoDTO;
use App\Domain\Inspection\Repositories\InspectionRepositoryInterface;
use App\Domain\Inspection\ValueObjects\CheckpointId;
use App\Domain\Storage\Repositories\FileStorageRepositoryInterface;

final class AddCheckpointPhotoUseCase
{
    public function __construct(
        private readonly InspectionRepositoryInterface $repository,
        private readonly FileStorageRepositoryInterface $fileStorage
    ) {}

    public function execute(AddCheckpointPhotoDTO $dto): array
    {
        $checkpoint = $this->repository->findCheckpointById(new CheckpointId($dto->checkpointId));

        if (! $checkpoint) {
            throw new \RuntimeException('Checkpoint not found');
        }

        // Upload photo to storage using specialized method
        $photoUrl = $this->fileStorage->storeInspectionPhoto(
            $dto->photoFile,
            $dto->checkpointId
        );

        $checkpoint->addPhoto($photoUrl);

        $this->repository->saveCheckpoint($checkpoint);

        return [
            'checkpoint_id' => $checkpoint->getCheckpointId()->getValue(),
            'photo_url' => $photoUrl,
            'photos' => $checkpoint->getPhotos(),
            'updated_at' => $checkpoint->getUpdatedAt()?->toISOString(),
        ];
    }
}
