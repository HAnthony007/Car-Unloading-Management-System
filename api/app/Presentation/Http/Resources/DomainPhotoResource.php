<?php

namespace App\Presentation\Http\Resources;

use App\Domain\Storage\Repositories\StorageRepositoryInterface as StorageRepo;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

final class DomainPhotoResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $p = $this->resource;

        $photoPath = $p->getPhotoPath();
        $photoUrl = $this->makeUrlSafe($photoPath);

        return [
            'photo_id' => $p->getPhotoId()?->getValue(),
            'photo_path' => $p->getPhotoPath(),
            'photo' => [
                'path' => $photoPath,
                'url' => $photoUrl,
            ],
            'taken_at' => $p->getTakenAt()->toISOString(),
            'photo_description' => $p->getPhotoDescription(),
            'discharge_id' => $p->getDischargeId()->getValue(),
            'survey_id' => $p->getSurveyId()?->getValue(),
            'checkpoint_id' => $p->getCheckpointId()?->getValue(),
            'created_at' => $p->getCreatedAt()?->toISOString(),
            'updated_at' => $p->getUpdatedAt()?->toISOString(),
        ];
    }

    private function makeUrlSafe(?string $path): ?string
    {
        if (empty($path)) {
            return null;
        }

        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
            return $path;
        }

        try {
            /** @var StorageRepo $storage */
            $storage = app(StorageRepo::class);

            return $storage->url($path);
        } catch (\Throwable $e) {
            return null;
        }
    }
}
