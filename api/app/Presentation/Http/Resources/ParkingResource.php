<?php

namespace App\Presentation\Http\Resources;

use App\Domain\Parking\Entities\Parking;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

final class ParkingResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        /** @var Parking $parking */
        $parking = $this->resource;

        return [
            'parking_id' => $parking->getParkingId()?->getValue(),
            'parking_name' => $parking->getParkingName()->getValue(),
            'location' => $parking->getLocation()->getValue(),
            'capacity' => $parking->getCapacity()->getValue(),
            'parking_number' => $parking->getParkingNumber()?->getValue(),
            'created_at' => $parking->getCreatedAt()?->toISOString(),
            'updated_at' => $parking->getUpdatedAt()?->toISOString(),
        ];
    }
}
