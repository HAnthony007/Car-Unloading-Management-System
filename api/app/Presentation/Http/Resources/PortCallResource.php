<?php

namespace App\Presentation\Http\Resources;

use App\Domain\PortCall\Entities\PortCall as DomainPortCall;
use App\Models\PortCall as EloquentPortCall;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

final class PortCallResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        /** @var DomainPortCall $pc */
        $pc = $this->resource;

        // Try to fetch the Eloquent model to enrich with related data and custom columns
        $pcModel = null;
        try {
            $id = $pc->getPortCallId()?->getValue();
            $pcModel = $id ? EloquentPortCall::with(['vessel', 'dock'])->find($id) : null;
        } catch (\Throwable $e) {
            // ignore enrichment errors; base fields still returned
        }

        return [
            'port_call_id' => $pc->getPortCallId()?->getValue(),
            'vessel_agent' => $pc->getVesselAgent()->getValue(),
            'origin_port' => $pc->getOriginPort()->getValue(),
            'estimated_arrival' => $pc->getEstimatedArrival()->getValue()?->toISOString(),
            'arrival_date' => $pc->getArrivalDate()->getValue()?->toISOString(),
            'estimated_departure' => $pc->getEstimatedDeparture()->getValue()?->toISOString(),
            'departure_date' => $pc->getDepartureDate()->getValue()?->toISOString(),
            'vessel_id' => $pc->getVesselId()->getValue(),
            'dock_id' => $pc->getDockId()?->getValue(),
            // Extra attributes
            'vehicles_number' => $pcModel?->vehicles_number,
            'vessel' => $pcModel && $pcModel->relationLoaded('vessel') && $pcModel->vessel ? $pcModel->vessel->toArray() : null,
            'dock' => $pcModel && $pcModel->relationLoaded('dock') && $pcModel->dock ? $pcModel->dock->toArray() : null,
            'created_at' => $pc->getCreatedAt()?->toISOString(),
            'updated_at' => $pc->getUpdatedAt()?->toISOString(),
        ];
    }
}
