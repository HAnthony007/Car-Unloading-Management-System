<?php

namespace App\Presentation\Http\Resources;

use App\Domain\Vessel\Entities\Vessel;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

final class VesselResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        /** @var Vessel $vessel */
        $vessel = $this->resource;

        return [
            'vessel_id' => $vessel->getVesselId()?->getValue(),
            'imo_no' => $vessel->getImoNumber()->getValue(),
            'vessel_name' => $vessel->getVesselName()->getValue(),
            'flag' => $vessel->getFlag()->getValue(),
            'created_at' => $vessel->getCreatedAt()?->toISOString(),
            'updated_at' => $vessel->getUpdatedAt()?->toISOString(),
        ];
    }
}
