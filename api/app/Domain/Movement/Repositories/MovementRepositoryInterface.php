<?php

namespace App\Domain\Movement\Repositories;

use App\Domain\Discharge\ValueObjects\DischargeId;
use App\Domain\Movement\Entities\Movement;
use App\Domain\Movement\ValueObjects\MovementId;
use App\Domain\User\ValueObjects\UserId;

interface MovementRepositoryInterface
{
    public function findById(MovementId $id): ?Movement;

    /** @return array<int, Movement> */
    public function findByDischarge(DischargeId $dischargeId): array;

    /** @return array<int, Movement> */
    public function findByUser(UserId $userId): array;

    /** @return array<int, Movement> */
    public function findAll(): array;

    public function save(Movement $movement): Movement;

    public function delete(MovementId $id): bool;

    /**
     * @return array{data: array<int, Movement>, current_page: int, from: int, last_page: int, path: string, per_page: int, to: int, total: int}
     */
    public function search(?int $dischargeId, ?int $userId, ?string $from, ?string $to, ?string $note, int $page, int $perPage): array;

    /**
     * Return vehicle IDs whose latest movement destination equals the given location name.
     *
     * @return array<int>
     */
    public function findDischargeIdsAtLocation(string $locationName): array;

    /**
     * Return a map of vehicle_id => parking_number (nullable) for vehicles whose latest
     * movement destination equals the given location name.
     *
     * @return array<int, string|null>
     */
    public function findLatestParkingNumbersForDischargesAtLocation(string $locationName): array;
}
