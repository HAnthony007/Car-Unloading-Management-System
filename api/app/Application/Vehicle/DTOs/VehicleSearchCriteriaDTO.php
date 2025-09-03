<?php

namespace App\Application\Vehicle\DTOs;

final class VehicleSearchCriteriaDTO
{
    public function __construct(
        public readonly ?string $vin = null,
        public readonly ?int $dischargeId = null,
        public readonly ?string $make = null,
    public readonly ?string $model = null,
    public readonly ?string $ownerName = null,
    public readonly ?string $color = null,
    public readonly ?string $type = null,
    public readonly ?string $originCountry = null,
    public readonly ?string $searchTerm = null,
    public readonly int $page = 1,
        public readonly int $perPage = 15,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            vin: $data['vin'] ?? null,
            dischargeId: isset($data['discharge_id']) ? (int) $data['discharge_id'] : null,
            make: $data['make'] ?? null,
            model: $data['model'] ?? null,
            ownerName: $data['owner_name'] ?? null,
            color: $data['color'] ?? null,
            type: $data['type'] ?? null,
            originCountry: $data['origin_country'] ?? null,
            searchTerm: $data['search_term'] ?? null,
            page: (int) ($data['page'] ?? 1),
            perPage: (int) ($data['per_page'] ?? 15),
        );
    }
}
