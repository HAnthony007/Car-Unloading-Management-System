<?php

namespace App\Application\Dock\DTOs;

final class CreateDockDTO
{
    public function __construct(
        public readonly string $dockName,
        public readonly string $location,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            dockName: $data['dock_name'] ?? '',
            location: $data['location'] ?? '',
        );
    }

    public function toArray(): array
    {
        return [
            'dock_name' => $this->dockName,
            'location' => $this->location,
        ];
    }
}
