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

        // If the original resource is an Eloquent model already loaded with relations, reuse it.
        $eloquent = $this->resource instanceof EloquentDischarge ? $this->resource : null;
        if (! $eloquent) {
            try {
                $id = $d->getDischargeId()?->getValue();
                $eloquent = $id ? EloquentDischarge::with(['portCall.vessel', 'portCall.dock', 'vehicle', 'agent'])->find($id) : null;
            } catch (\Throwable $e) {
                // ignore enrichment errors
            }
        }

        $portCall = null;
        $vehicle = null;
        $agent = null;
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

        if ($eloquent) {
            try {
                if ($eloquent->relationLoaded('vehicle') || method_exists($eloquent, 'vehicle')) {
                    $vehicle = $eloquent->vehicle?->toArray();
                }
                if ($eloquent->relationLoaded('agent') || method_exists($eloquent, 'agent')) {
                    $agent = $eloquent->agent?->toArray();
                }
            } catch (\Throwable $e) {
                // ignore
            }
        }

        return [
            'discharge_id' => $d->getDischargeId()?->getValue(),
            'discharge_date' => $d->getDischargeDate()->getValue()?->toIso8601String(),
            'port_call_id' => $d->getPortCallId()->getValue(),
            'vehicle_id' => $d->getVehicleId()->getValue(),
            'agent_id' => $d->getAgentId()->getValue(),
            'port_call' => $portCall,
            'vehicle' => $vehicle,
            'agent' => $agent,
            'created_at' => $d->getCreatedAt()?->toIso8601String(),
            'updated_at' => $d->getUpdatedAt()?->toIso8601String(),
        ];
    }
}
