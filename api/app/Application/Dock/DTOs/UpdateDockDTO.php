<?php

namespace App\Application\Dock\DTOs;

final class UpdateDockDTO
{
    public function __construct(
        public readonly int $dockId,
        public readonly ?string $dockName = null,
        public readonly ?string $location = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            dockId: (int) ($data['dock_id'] ?? 0),
            dockName: $data['dock_name'] ?? null,
            location: $data['location'] ?? null,
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

        return $data;
    }
}
