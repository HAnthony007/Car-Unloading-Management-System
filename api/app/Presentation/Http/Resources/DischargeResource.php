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
        // Resource may be a Domain Discharge entity OR an Eloquent model. Normalise accessors.
        $eloquent = $this->resource instanceof EloquentDischarge ? $this->resource : null;
        $domain = $this->resource instanceof Discharge ? $this->resource : null;

        // When only a domain entity is provided (e.g., listing), avoid refetching from DB to keep queries low.

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
                // If relation is not loaded, avoid triggering lazy load during list serialization
                if ($eloquent->relationLoaded('vehicle')) {
                    $vehicle = $eloquent->vehicle?->toArray();
                }
                if ($eloquent->relationLoaded('agent')) {
                    $agent = $eloquent->agent?->toArray();
                }
            } catch (\Throwable $e) {
                // ignore
            }
        }

        // Extract scalar fields from whichever representation we have.
        if ($domain) {
            $dischargeId = $domain->getDischargeId()?->getValue();
            $dischargeDate = $domain->getDischargeDate()->getValue()?->toIso8601String();
            $portCallId = $domain->getPortCallId()->getValue();
            $vehicleId = $domain->getVehicleId()->getValue();
            $agentId = $domain->getAgentId()->getValue();
            $createdAt = $domain->getCreatedAt()?->toIso8601String();
            $updatedAt = $domain->getUpdatedAt()?->toIso8601String();
        }

        if ($eloquent) {
            $dischargeId = $eloquent->discharge_id;
            $dischargeDate = $eloquent->discharge_timestamp?->toIso8601String();
            $portCallId = $eloquent->port_call_id;
            $vehicleId = $eloquent->vehicle_id;
            $agentId = $eloquent->agent_id;
            $createdAt = $eloquent->created_at?->toIso8601String();
            $updatedAt = $eloquent->updated_at?->toIso8601String();
        }

        // Final fallback if still nothing (should not happen)
        $dischargeId = $dischargeId ?? null;
        $dischargeDate = $dischargeDate ?? null;
        $portCallId = $portCallId ?? null;
        $vehicleId = $vehicleId ?? null;
        $agentId = $agentId ?? null;
        $createdAt = $createdAt ?? null;
        $updatedAt = $updatedAt ?? null;

        return [
            'discharge_id' => $dischargeId,
            'discharge_date' => $dischargeDate,
            'port_call_id' => $portCallId,
            'vehicle_id' => $vehicleId,
            'agent_id' => $agentId,
            'port_call' => $portCall,
            'vehicle' => $vehicle,
            'agent' => $agent,
            'created_at' => $createdAt,
            'updated_at' => $updatedAt,
        ];
    }
}
