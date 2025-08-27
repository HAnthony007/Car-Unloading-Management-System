<?php

namespace App\Presentation\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

final class VehicleResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $v = $this->resource;

        return [
            'vehicle_id' => $v->getVehicleId()?->getValue(),
            'vin' => $v->getVin()->getValue(),
            'make' => $v->getMake(),
            'model' => $v->getModel(),
            'color' => $v->getColor(),
            'type' => $v->getType(),
            'weight' => $v->getWeight(),
            'vehicle_condition' => $v->getVehicleCondition(),
            'vehicle_observation' => $v->getVehicleObservation(),
            'origin_country' => $v->getOriginCountry(),
            'ship_location' => $v->getShipLocation(),
            'is_primed' => $v->isPrimed(),
            'discharge_id' => $v->getDischargeId()->getValue(),
            'created_at' => $v->getCreatedAt()?->toISOString(),
            'updated_at' => $v->getUpdatedAt()?->toISOString(),
        ];
    }
}
