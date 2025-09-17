<?php

namespace App\Application\Dock\DTOs;

final class CreateDockDTO
{
    public function __construct(
        public readonly string $dockName,
        public readonly string $location,
    public readonly ?float $latitude = null,
    public readonly ?float $longitude = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            dockName: $data['dock_name'] ?? '',
            location: $data['location'] ?? '',
            latitude: isset($data['latitude']) ? (float) $data['latitude'] : null,
            longitude: isset($data['longitude']) ? (float) $data['longitude'] : null,
        );
    }

    public function toArray(): array
    {
        $data = [
            'dock_name' => $this->dockName,
            'location' => $this->location,
        ];
        if ($this->latitude !== null) {
            $data['latitude'] = $this->latitude;
        }
        if ($this->longitude !== null) {
            $data['longitude'] = $this->longitude;
        }
        return $data;
    }
}
