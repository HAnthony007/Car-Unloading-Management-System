<?php

namespace App\Application\Photo\UseCases;

use App\Application\Photo\DTOs\CreatePhotoDTO;
use App\Domain\Discharge\ValueObjects\DischargeId;
use App\Domain\Photo\Entities\Photo;
use App\Domain\Photo\Repositories\PhotoRepositoryInterface;
use App\Domain\Survey\ValueObjects\SurveyId;
use App\Domain\SurveyCheckpoint\ValueObjects\SurveyCheckpointId;
use Carbon\Carbon;

final class CreatePhotoUseCase
{
    public function __construct(private readonly PhotoRepositoryInterface $photoRepository) {}

    public function execute(CreatePhotoDTO $dto): Photo
    {
        $dischargeId = new DischargeId($dto->dischargeId);
        $checkpointId = $dto->checkpointId ? new SurveyCheckpointId($dto->checkpointId) : null;
        $surveyId = $dto->surveyId ? new SurveyId($dto->surveyId) : null;

        $photo = new Photo(
            photoId: null,
            photoPath: $dto->photoPath,
            takenAt: new Carbon($dto->takenAt),
            photoDescription: $dto->photoDescription,
            dischargeId: $dischargeId,
            surveyId: $surveyId,
            checkpointId: $checkpointId,
        );

        return $this->photoRepository->save($photo);
    }
}
