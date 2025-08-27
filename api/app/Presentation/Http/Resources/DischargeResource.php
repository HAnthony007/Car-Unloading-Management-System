<?php

namespace App\Presentation\Http\Resources;

use App\Domain\Discharge\Entities\Discharge;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

final class DischargeResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        /** @var Discharge $d */
        $d = $this->resource;

        return [
            'discharge_id' => $d->getDischargeId()?->getValue(),
            'discharge_date' => $d->getDischargeDate()->getValue()?->toIso8601String(),
            'port_call_id' => $d->getPortCallId()->getValue(),
            'created_at' => $d->getCreatedAt()?->toIso8601String(),
            'updated_at' => $d->getUpdatedAt()?->toIso8601String(),
        ];
    }
}
