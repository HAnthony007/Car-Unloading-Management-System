<?php

namespace App\Application\Photo\UseCases;

use App\Application\Photo\DTOs\CreatePhotoDTO;
use App\Domain\FollowUpFile\ValueObjects\FollowUpFileId;
use App\Domain\Photo\Entities\Photo;
use App\Domain\Photo\Repositories\PhotoRepositoryInterface;
use App\Domain\SurveyCheckpoint\ValueObjects\SurveyCheckpointId;
use App\Domain\Vehicle\ValueObjects\VehicleId;
use Carbon\Carbon;

final class CreatePhotoUseCase
{
    public function __construct(private readonly PhotoRepositoryInterface $photoRepository) {}

    public function execute(CreatePhotoDTO $dto): Photo
    {
        $photo = new Photo(
            photoId: null,
            photoPath: $dto->photoPath,
            takenAt: new Carbon($dto->takenAt),
            photoDescription: $dto->photoDescription,
            followUpFileId: new FollowUpFileId($dto->followUpFileId),
            vehicleId: new VehicleId($dto->vehicleId),
            checkpointId: new SurveyCheckpointId($dto->checkpointId),
        );

        return $this->photoRepository->save($photo);
    }
}
