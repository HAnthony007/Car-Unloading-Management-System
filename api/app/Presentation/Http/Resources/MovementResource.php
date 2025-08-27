<?php

namespace App\Presentation\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

final class MovementResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $m = $this->resource;

        return [
            'movement_id' => $m->getMovementId()?->getValue(),
            'note' => $m->getNote(),
            'timestamp' => $m->getTimestamp()->toISOString(),
            'from' => $m->getFrom()->getValue(),
            'to' => $m->getTo()->getValue(),
            'vehicle_id' => $m->getVehicleId()->getValue(),
            'user_id' => $m->getUserId()->getValue(),
            'created_at' => $m->getCreatedAt()?->toISOString(),
            'updated_at' => $m->getUpdatedAt()?->toISOString(),
        ];
    }
}
