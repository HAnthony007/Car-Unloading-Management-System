<?php

namespace App\Presentation\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

final class MovementResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $m = $this->resource;

        // Prefer stored coords; fallback to derivation by location name
        $fromCoords = [
            'lat' => $m->getFromLatitude(),
            'lng' => $m->getFromLongitude(),
        ];
        $toCoords = [
            'lat' => $m->getToLatitude(),
            'lng' => $m->getToLongitude(),
        ];
        if ($fromCoords['lat'] === null || $fromCoords['lng'] === null) {
            $fromCoords = $this->lookupCoords($m->getFrom()->getValue());
        }
        if ($toCoords['lat'] === null || $toCoords['lng'] === null) {
            $toCoords = $this->lookupCoords($m->getTo()->getValue());
        }

        return [
            'movement_id' => $m->getMovementId()?->getValue(),
            'note' => $m->getNote(),
            'timestamp' => $m->getTimestamp()->toISOString(),
            'from' => $m->getFrom()->getValue(),
            'to' => $m->getTo()->getValue(),
            'from_latitude' => $fromCoords['lat'],
            'from_longitude' => $fromCoords['lng'],
            'to_latitude' => $toCoords['lat'],
            'to_longitude' => $toCoords['lng'],
            'discharge_id' => $m->getDischargeId()->getValue(),
            'user_id' => $m->getUserId()->getValue(),
            'parking_number' => $m->getParkingNumber(),
            'created_at' => $m->getCreatedAt()?->toISOString(),
            'updated_at' => $m->getUpdatedAt()?->toISOString(),
        ];
    }

    private function lookupCoords(?string $name): array
    {
        if (! $name) {
            return ['lat' => null, 'lng' => null];
        }
        // Lazy DB lookups; acceptable for small lists. For large scale, add eager data in controller.
        $dock = \App\Models\Dock::where('dock_name', $name)->first();
        if ($dock && $dock->latitude !== null && $dock->longitude !== null) {
            return ['lat' => (float) $dock->latitude, 'lng' => (float) $dock->longitude];
        }
        $parking = \App\Models\Parking::where('parking_name', $name)->first();
        if ($parking && $parking->latitude !== null && $parking->longitude !== null) {
            return ['lat' => (float) $parking->latitude, 'lng' => (float) $parking->longitude];
        }
        return ['lat' => null, 'lng' => null];
    }
}
