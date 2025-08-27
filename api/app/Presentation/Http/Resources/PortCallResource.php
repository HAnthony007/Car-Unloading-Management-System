<?php

namespace App\Presentation\Http\Resources;

use App\Domain\PortCall\Entities\PortCall;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

final class PortCallResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        /** @var PortCall $pc */
        $pc = $this->resource;

        return [
            'port_call_id' => $pc->getPortCallId()?->getValue(),
            'vessel_agent' => $pc->getVesselAgent()->getValue(),
            'origin_port' => $pc->getOriginPort()->getValue(),
            'estimated_arrival' => $pc->getEstimatedArrival()->getValue()?->toISOString(),
            'arrival_date' => $pc->getArrivalDate()->getValue()?->toISOString(),
            'estimated_departure' => $pc->getEstimatedDeparture()->getValue()?->toISOString(),
            'departure_date' => $pc->getDepartureDate()->getValue()?->toISOString(),
            'vessel_id' => $pc->getVesselId()->getValue(),
            'dock_id' => $pc->getDockId()->getValue(),
            'created_at' => $pc->getCreatedAt()?->toISOString(),
            'updated_at' => $pc->getUpdatedAt()?->toISOString(),
        ];
    }
}
