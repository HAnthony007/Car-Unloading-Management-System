<?php

namespace App\Presentation\Http\Resources;

use App\Domain\Discharge\Entities\Discharge;
use App\Models\Discharge as EloquentDischarge;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

final class DischargeResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        /** @var Discharge $d */
        $d = $this->resource;

        // Try to load the Eloquent discharge with the related port call (including vessel and dock)
        $eloquent = null;
        try {
            $id = $d->getDischargeId()?->getValue();
            $eloquent = $id ? EloquentDischarge::with(['portCall.vessel', 'portCall.dock'])->find($id) : null;
        } catch (\Throwable $e) {
            // ignore enrichment errors
        }

        $portCall = null;
        if ($eloquent && $eloquent->relationLoaded('portCall') && $eloquent->portCall) {
            $pc = $eloquent->portCall;
            $portCall = array_merge(
                $pc->toArray(),
                [
                    'vessel' => $pc->relationLoaded('vessel') && $pc->vessel ? $pc->vessel->toArray() : null,
                    'dock' => $pc->relationLoaded('dock') && $pc->dock ? $pc->dock->toArray() : null,
                ]
            );
        }

        return [
            'discharge_id' => $d->getDischargeId()?->getValue(),
            'discharge_date' => $d->getDischargeDate()->getValue()?->toIso8601String(),
            'port_call_id' => $d->getPortCallId()->getValue(),
            'port_call' => $portCall,
            'created_at' => $d->getCreatedAt()?->toIso8601String(),
            'updated_at' => $d->getUpdatedAt()?->toIso8601String(),
        ];
    }
}
