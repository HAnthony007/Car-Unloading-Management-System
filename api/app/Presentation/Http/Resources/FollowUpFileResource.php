<?php

namespace App\Presentation\Http\Resources;

use App\Models\PortCall;
use App\Models\Survey;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

final class FollowUpFileResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $f = $this->resource;
        $id = $f->getFollowUpFileId()?->getValue();

        // Fetch related entities for enriched response
        $vehicle = null;
        $portCall = null;
        $survey = null;

        try {
            $vehicleId = $f->getVehicleId()->getValue();
            $vehicle = $vehicleId ? Vehicle::with(['discharge', 'movements'])->find($vehicleId) : null;
        } catch (\Throwable $e) {
            // ignore and keep null
        }

        try {
            $portCallId = $f->getPortCallId()->getValue();
            $portCall = $portCallId ? PortCall::with(['vessel', 'dock', 'discharges'])->find($portCallId) : null;
        } catch (\Throwable $e) {
            // ignore and keep null
        }

        // Survey now accessed via discharge -> survey, remove direct fetch
        $survey = null;

        return [
            'follow_up_file_id' => $id !== null ? (string) $id : null,
            'bill_of_lading' => $f->getBillOfLading()->getValue(),
            'status' => $f->getStatus()->getValue(),
            'vehicle_id' => $f->getVehicleId()->getValue(),
            'port_call_id' => $f->getPortCallId()->getValue(),
            // Embedded full related data
            'vehicle' => $vehicle ? array_merge(
                $vehicle->toArray(),
                [
                    'discharge' => $vehicle->relationLoaded('discharge') && $vehicle->discharge ? $vehicle->discharge->toArray() : null,
                    'movements' => $vehicle->relationLoaded('movements') && $vehicle->movements ? $vehicle->movements->toArray() : [],
                ]
            ) : null,
            'port_call' => $portCall ? array_merge(
                $portCall->toArray(),
                [
                    'vessel' => $portCall->relationLoaded('vessel') && $portCall->vessel ? $portCall->vessel->toArray() : null,
                    'dock' => $portCall->relationLoaded('dock') && $portCall->dock ? $portCall->dock->toArray() : null,
                    'discharges' => $portCall->relationLoaded('discharges') && $portCall->discharges ? $portCall->discharges->toArray() : [],
                ]
            ) : null,
            'survey' => null,
            'created_at' => $f->getCreatedAt()?->toISOString(),
            'updated_at' => $f->getUpdatedAt()?->toISOString(),
        ];
    }
}
