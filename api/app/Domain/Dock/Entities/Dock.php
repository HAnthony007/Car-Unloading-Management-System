<?php

namespace App\Domain\Dock\Entities;

use App\Domain\Dock\ValueObjects\DockId;
use App\Domain\Dock\ValueObjects\DockName;
use App\Domain\Dock\ValueObjects\Location;
use Carbon\Carbon;

final class Dock
{
    public function __construct(
        private readonly ?DockId $dockId,
        private readonly DockName $dockName,
        private readonly Location $location,
        private readonly ?Carbon $createdAt = null,
        private readonly ?Carbon $updatedAt = null
    ) {}

    public function getDockId(): ?DockId
    {
        return $this->dockId;
    }

    public function getDockName(): DockName
    {
        return $this->dockName;
    }

    public function getLocation(): Location
    {
        return $this->location;
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
            'dock_id' => $this->dockId?->getValue(),
            'dock_name' => $this->dockName->getValue(),
            'location' => $this->location->getValue(),
            'created_at' => $this->createdAt?->toISOString(),
            'updated_at' => $this->updatedAt?->toISOString(),
        ];
    }
}
