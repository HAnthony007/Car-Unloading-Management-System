<?php

namespace App\Presentation\Http\Resources;

use App\Domain\Storage\Repositories\StorageRepositoryInterface as StorageRepo;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

final class PhotoResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $p = $this->resource;

        $path = $p->photo_path;
        $url = $this->makeUrlSafe($path);

        return [
            'photo_id' => $p->photo_id,
            'photo_path' => $p->photo_path,
            'photo' => [
                'path' => $path,
                'url' => $url,
            ],
            'taken_at' => $p->taken_at,
            'photo_description' => $p->photo_description,
            'follow_up_file_id' => $p->follow_up_file_id,
            'checkpoint_id' => $p->checkpoint_id,
            'created_at' => $p->created_at,
            'updated_at' => $p->updated_at,
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
