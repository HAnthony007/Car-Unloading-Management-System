<?php

namespace App\Application\Photo\UseCases;

use App\Application\Photo\DTOs\UpdatePhotoDTO;
use App\Domain\FollowUpFile\ValueObjects\FollowUpFileId;
use App\Domain\Photo\Entities\Photo;
use App\Domain\Photo\Repositories\PhotoRepositoryInterface;
use App\Domain\Photo\ValueObjects\PhotoId;
use App\Domain\SurveyCheckpoint\ValueObjects\SurveyCheckpointId;
use App\Domain\Vehicle\ValueObjects\VehicleId;
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

        $photo = new Photo(
            photoId: new PhotoId($dto->photoId),
            photoPath: $dto->photoPath ?? $existing->getPhotoPath(),
            takenAt: new Carbon($dto->takenAt ?? $existing->getTakenAt()->toISOString()),
            photoDescription: $dto->photoDescription ?? $existing->getPhotoDescription(),
            followUpFileId: new FollowUpFileId($dto->followUpFileId ?? $existing->getFollowUpFileId()->getValue()),
            vehicleId: new VehicleId($dto->vehicleId ?? $existing->getVehicleId()->getValue()),
            checkpointId: new SurveyCheckpointId($dto->checkpointId ?? $existing->getCheckpointId()->getValue()),
            createdAt: $existing->getCreatedAt(),
            updatedAt: $existing->getUpdatedAt(),
        );

        return $this->repo->save($photo);
    }
}
