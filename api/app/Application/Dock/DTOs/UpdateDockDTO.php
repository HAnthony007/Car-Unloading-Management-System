<?php

namespace App\Application\Dock\DTOs;

final class UpdateDockDTO
{
    public function __construct(
        public readonly int $dockId,
        public readonly ?string $dockName = null,
        public readonly ?string $location = null,
        public readonly ?float $latitude = null,
        public readonly ?float $longitude = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            dockId: (int) ($data['dock_id'] ?? 0),
            dockName: $data['dock_name'] ?? null,
            location: $data['location'] ?? null,
            latitude: isset($data['latitude']) ? (float) $data['latitude'] : null,
            longitude: isset($data['longitude']) ? (float) $data['longitude'] : null,
        );
    }

    public function toArray(): array
    {
        $data = [];
        if ($this->dockName !== null) {
            $data['dock_name'] = $this->dockName;
        }
        if ($this->location !== null) {
            $data['location'] = $this->location;
        }
        if ($this->latitude !== null) {
            $data['latitude'] = $this->latitude;
        }
        if ($this->longitude !== null) {
            $data['longitude'] = $this->longitude;
        }

        return $data;
    }
}
