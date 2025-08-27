<?php

namespace App\Presentation\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

final class PhotoResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $p = $this->resource;

        return [
            'photo_id' => $p->photo_id,
            'photo_path' => $p->photo_path,
            'taken_at' => $p->taken_at,
            'photo_description' => $p->photo_description,
            'follow_up_file_id' => $p->follow_up_file_id,
            'vehicle_id' => $p->vehicle_id,
            'checkpoint_id' => $p->checkpoint_id,
            'created_at' => $p->created_at,
            'updated_at' => $p->updated_at,
        ];
    }
}
