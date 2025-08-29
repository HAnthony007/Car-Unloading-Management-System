<?php

namespace App\Application\Photo\UseCases;

use App\Application\Photo\DTOs\UpdatePhotoDTO;
use App\Domain\FollowUpFile\ValueObjects\FollowUpFileId;
use App\Domain\Photo\Entities\Photo;
use App\Domain\Photo\Repositories\PhotoRepositoryInterface;
use App\Domain\Photo\ValueObjects\PhotoId;
use App\Domain\SurveyCheckpoint\ValueObjects\SurveyCheckpointId;
use Carbon\Carbon;

final class UpdatePhotoUseCase
{
    public function __construct(private readonly PhotoRepositoryInterface $repo) {}

    public function execute(UpdatePhotoDTO $dto): Photo
    {
        $existing = $this->repo->findById(new PhotoId($dto->photoId));
        if (! $existing) {
            throw new \RuntimeException('Photo not found.');
        }

        $followUpFileId = isset($dto->followUpFileId)
            ? ($dto->followUpFileId ? new FollowUpFileId($dto->followUpFileId) : null)
            : $existing->getFollowUpFileId();
        $checkpointId = isset($dto->checkpointId)
            ? ($dto->checkpointId ? new SurveyCheckpointId($dto->checkpointId) : null)
            : $existing->getCheckpointId();

        // Enforce XOR at update time too if both provided
        if (! is_null($followUpFileId) && ! is_null($checkpointId)) {
            throw new \InvalidArgumentException('Provide either follow_up_file_id or checkpoint_id, not both.');
        }

        $photo = new Photo(
            photoId: new PhotoId($dto->photoId),
            photoPath: $dto->photoPath ?? $existing->getPhotoPath(),
            takenAt: new Carbon($dto->takenAt ?? $existing->getTakenAt()->toISOString()),
            photoDescription: $dto->photoDescription ?? $existing->getPhotoDescription(),
            followUpFileId: $followUpFileId,
            checkpointId: $checkpointId,
            createdAt: $existing->getCreatedAt(),
            updatedAt: $existing->getUpdatedAt(),
        );

        return $this->repo->save($photo);
    }
}
