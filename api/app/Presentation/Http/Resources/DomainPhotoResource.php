<?php

namespace App\Presentation\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

final class DomainPhotoResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $p = $this->resource;

        return [
            'photo_id' => $p->getPhotoId()?->getValue(),
            'photo_path' => $p->getPhotoPath(),
            'taken_at' => $p->getTakenAt()->toISOString(),
            'photo_description' => $p->getPhotoDescription(),
            'follow_up_file_id' => $p->getFollowUpFileId()->getValue(),
            'vehicle_id' => $p->getVehicleId()->getValue(),
            'checkpoint_id' => $p->getCheckpointId()->getValue(),
            'created_at' => $p->getCreatedAt()?->toISOString(),
            'updated_at' => $p->getUpdatedAt()?->toISOString(),
        ];
    }
}
