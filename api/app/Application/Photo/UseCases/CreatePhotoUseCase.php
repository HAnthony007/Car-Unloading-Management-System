<?php

namespace App\Application\Photo\UseCases;

use App\Application\Photo\DTOs\CreatePhotoDTO;
use App\Domain\FollowUpFile\ValueObjects\FollowUpFileId;
use App\Domain\Photo\Entities\Photo;
use App\Domain\Photo\Repositories\PhotoRepositoryInterface;
use App\Domain\SurveyCheckpoint\ValueObjects\SurveyCheckpointId;
use Carbon\Carbon;

final class CreatePhotoUseCase
{
    public function __construct(private readonly PhotoRepositoryInterface $photoRepository) {}

    public function execute(CreatePhotoDTO $dto): Photo
    {
        // Enforce XOR: exactly one of followUpFileId or checkpointId must be provided; vehicleId is optional in that case
        $hasFuf = ! is_null($dto->followUpFileId);
        $hasCheckpoint = ! is_null($dto->checkpointId);
        if ($hasFuf === $hasCheckpoint) {
            throw new \InvalidArgumentException('Provide either follow_up_file_id or checkpoint_id, but not both.');
        }

        $followUpFileId = $hasFuf ? new FollowUpFileId($dto->followUpFileId) : null;
        $checkpointId = $hasCheckpoint ? new SurveyCheckpointId($dto->checkpointId) : null;

        $photo = new Photo(
            photoId: null,
            photoPath: $dto->photoPath,
            takenAt: new Carbon($dto->takenAt),
            photoDescription: $dto->photoDescription,
            followUpFileId: $followUpFileId,
            checkpointId: $checkpointId,
        );

        return $this->photoRepository->save($photo);
    }
}
