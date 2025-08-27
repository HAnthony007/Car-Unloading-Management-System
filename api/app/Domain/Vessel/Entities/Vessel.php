<?php

namespace App\Domain\Vessel\Entities;

use App\Domain\Vessel\ValueObjects\Flag;
use App\Domain\Vessel\ValueObjects\ImoNumber;
use App\Domain\Vessel\ValueObjects\VesselId;
use App\Domain\Vessel\ValueObjects\VesselName;
use Carbon\Carbon;

final class Vessel
{
    public function __construct(
        private readonly ?VesselId $vesselId,
        private readonly ImoNumber $imoNumber,
        private readonly VesselName $vesselName,
        private readonly Flag $flag,
        private readonly ?Carbon $createdAt = null,
        private readonly ?Carbon $updatedAt = null,
    ) {}

    public function getVesselId(): ?VesselId { return $this->vesselId; }
    public function getImoNumber(): ImoNumber { return $this->imoNumber; }
    public function getVesselName(): VesselName { return $this->vesselName; }
    public function getFlag(): Flag { return $this->flag; }
    public function getCreatedAt(): ?Carbon { return $this->createdAt; }
    public function getUpdatedAt(): ?Carbon { return $this->updatedAt; }

    public function toArray(): array
    {
        return [
            'vessel_id' => $this->vesselId?->getValue(),
            'imo_no' => $this->imoNumber->getValue(),
            'vessel_name' => $this->vesselName->getValue(),
            'flag' => $this->flag->getValue(),
            'created_at' => $this->createdAt?->toISOString(),
            'updated_at' => $this->updatedAt?->toISOString(),
        ];
    }
}
