<?php

namespace App\Application\Photo\UseCases;

use App\Application\Photo\DTOs\UpdatePhotoDTO;
use App\Domain\Discharge\ValueObjects\DischargeId;
use App\Domain\Photo\Entities\Photo;
use App\Domain\Photo\Repositories\PhotoRepositoryInterface;
use App\Domain\Photo\ValueObjects\PhotoId;
use App\Domain\Survey\ValueObjects\SurveyId;
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

        $dischargeId = isset($dto->dischargeId)
            ? ($dto->dischargeId ? new DischargeId($dto->dischargeId) : $existing->getDischargeId())
            : $existing->getDischargeId();
        $surveyId = isset($dto->surveyId)
            ? ($dto->surveyId ? new SurveyId($dto->surveyId) : null)
            : $existing->getSurveyId();
        $checkpointId = isset($dto->checkpointId)
            ? ($dto->checkpointId ? new SurveyCheckpointId($dto->checkpointId) : null)
            : $existing->getCheckpointId();

        $photo = new Photo(
            photoId: new PhotoId($dto->photoId),
            photoPath: $dto->photoPath ?? $existing->getPhotoPath(),
            takenAt: new Carbon($dto->takenAt ?? $existing->getTakenAt()->toISOString()),
            photoDescription: $dto->photoDescription ?? $existing->getPhotoDescription(),
            dischargeId: $dischargeId,
            surveyId: $surveyId,
            checkpointId: $checkpointId,
            createdAt: $existing->getCreatedAt(),
            updatedAt: $existing->getUpdatedAt(),
        );

        return $this->repo->save($photo);
    }
}
