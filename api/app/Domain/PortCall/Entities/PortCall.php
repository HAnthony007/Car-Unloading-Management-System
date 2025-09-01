<?php

namespace App\Domain\PortCall\Entities;

use App\Domain\Dock\ValueObjects\DockId;
use App\Domain\PortCall\ValueObjects\DateTimeValue;
use App\Domain\PortCall\ValueObjects\OriginPort;
use App\Domain\PortCall\ValueObjects\PortCallId;
use App\Domain\PortCall\ValueObjects\VesselAgent;
use App\Domain\Vessel\ValueObjects\VesselId;
use Carbon\Carbon;

final class PortCall
{
    public function __construct(
        private readonly ?PortCallId $portCallId,
        private readonly VesselAgent $vesselAgent,
        private readonly OriginPort $originPort,
        private readonly DateTimeValue $estimatedArrival,
        private readonly DateTimeValue $arrivalDate,
        private readonly DateTimeValue $estimatedDeparture,
        private readonly DateTimeValue $departureDate,
        private readonly VesselId $vesselId,
    private readonly ?DockId $dockId,
        private readonly ?Carbon $createdAt = null,
        private readonly ?Carbon $updatedAt = null,
    ) {}

    public function getPortCallId(): ?PortCallId
    {
        return $this->portCallId;
    }

    public function getVesselAgent(): VesselAgent
    {
        return $this->vesselAgent;
    }

    public function getOriginPort(): OriginPort
    {
        return $this->originPort;
    }

    public function getEstimatedArrival(): DateTimeValue
    {
        return $this->estimatedArrival;
    }

    public function getArrivalDate(): DateTimeValue
    {
        return $this->arrivalDate;
    }

    public function getEstimatedDeparture(): DateTimeValue
    {
        return $this->estimatedDeparture;
    }

    public function getDepartureDate(): DateTimeValue
    {
        return $this->departureDate;
    }

    public function getVesselId(): VesselId
    {
        return $this->vesselId;
    }

    public function getDockId(): ?DockId
    {
        return $this->dockId;
    }

    public function getCreatedAt(): ?Carbon
    {
        return $this->createdAt;
    }

    public function getUpdatedAt(): ?Carbon
    {
        return $this->updatedAt;
    }

    public function toArray(): array
    {
        return [
            'port_call_id' => $this->portCallId?->getValue(),
            'vessel_agent' => $this->vesselAgent->getValue(),
            'origin_port' => $this->originPort->getValue(),
            'estimated_arrival' => $this->estimatedArrival->getValue()?->toISOString(),
            'arrival_date' => $this->arrivalDate->getValue()?->toISOString(),
            'estimated_departure' => $this->estimatedDeparture->getValue()?->toISOString(),
            'departure_date' => $this->departureDate->getValue()?->toISOString(),
            'vessel_id' => $this->vesselId->getValue(),
            'dock_id' => $this->dockId?->getValue(),
            'created_at' => $this->createdAt?->toISOString(),
            'updated_at' => $this->updatedAt?->toISOString(),
        ];
    }
}
