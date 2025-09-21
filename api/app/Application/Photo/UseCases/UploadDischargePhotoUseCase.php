<?php

namespace App\Application\Photo\UseCases;

use App\Application\Photo\DTOs\UploadDischargePhotoDTO;
use App\Domain\Discharge\ValueObjects\DischargeId;
use App\Domain\Photo\Entities\Photo as DomainPhoto;
use App\Domain\Photo\Repositories\PhotoRepositoryInterface;
use App\Domain\Storage\Repositories\StorageRepositoryInterface;
use App\Domain\SurveyCheckpoint\ValueObjects\SurveyCheckpointId;
use Carbon\Carbon;

final class UploadDischargePhotoUseCase
{
    public function __construct(
        private readonly StorageRepositoryInterface $storage,
        private readonly PhotoRepositoryInterface $photos,
    ) {}

    public function execute(UploadDischargePhotoDTO $dto): DomainPhoto
    {
        $dir = 'photos/discharges/'.$dto->dischargeId.'/';

        // Restrict to images as per conventions
    $allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    $maxSize = 10 * 1024 * 1024; // 10MB

        // Store file and get relative path from repository (unique filename inside dir)
        if (method_exists($this->storage, 'storeUploadedFile')) {
            $path = $this->storage->storeUploadedFile($dto->file, $dir, $dto->visibility, $allowed, $maxSize);
        } else {
            $path = $this->storage->store($dir, $dto->file, $dto->visibility);
        }

        $domain = new DomainPhoto(
            photoId: null,
            photoPath: $path,
            takenAt: new Carbon($dto->takenAt),
            photoDescription: $dto->photoDescription,
            dischargeId: new DischargeId($dto->dischargeId),
            surveyId: null,
            checkpointId: $dto->checkpointId ? new SurveyCheckpointId($dto->checkpointId) : null,
        );

        return $this->photos->save($domain);
    }
}
