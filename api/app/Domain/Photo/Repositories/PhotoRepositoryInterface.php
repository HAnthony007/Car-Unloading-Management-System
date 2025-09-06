<?php

namespace App\Domain\Photo\Repositories;

use App\Domain\Photo\Entities\Photo;
use App\Domain\Photo\ValueObjects\PhotoId;

interface PhotoRepositoryInterface
{
    public function findById(PhotoId $id): ?Photo;

    /** @return array<int, Photo> */
    public function findAll(): array;

    public function save(Photo $photo): Photo;

    public function delete(PhotoId $id): bool;

    /**
     * @return array{data: array<int, Photo>, current_page: int, from: int, last_page: int, path: string, per_page: int, to: int, total: int}
     */
    public function search(?int $dischargeId, ?int $surveyId, ?int $checkpointId, ?string $fromDate, ?string $toDate, int $page, int $perPage): array;
}
