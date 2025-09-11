<?php

namespace App\Application\PortCall\DTOs;

final class PortCallSearchCriteriaDTO
{
    public function __construct(
        public readonly ?string $vesselAgent = null,
        public readonly ?string $originPort = null,
        public readonly ?string $status = null,
        public readonly ?string $searchTerm = null, // generic search (vessel agent, origin port)
        public readonly ?string $arrivalFrom = null, // date string
        public readonly ?string $arrivalTo = null,
        public readonly int $page = 1,
        public readonly int $perPage = 15,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            vesselAgent: isset($data['vessel_agent']) ? (string) $data['vessel_agent'] : null,
            originPort: isset($data['origin_port']) ? (string) $data['origin_port'] : null,
            status: isset($data['status']) ? (string) $data['status'] : null,
            searchTerm: isset($data['search_term']) ? (string) $data['search_term'] : null,
            arrivalFrom: isset($data['arrival_from']) ? (string) $data['arrival_from'] : null,
            arrivalTo: isset($data['arrival_to']) ? (string) $data['arrival_to'] : null,
            page: isset($data['page']) ? (int) $data['page'] : 1,
            perPage: isset($data['per_page']) ? (int) $data['per_page'] : 15,
        );
    }
}
