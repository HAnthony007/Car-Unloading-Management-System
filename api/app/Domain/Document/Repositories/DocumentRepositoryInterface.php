<?php

namespace App\Domain\Document\Repositories;

use App\Domain\Document\Entities\Document;
use App\Domain\Document\ValueObjects\DocumentId;

interface DocumentRepositoryInterface
{
    public function findById(DocumentId $id): ?Document;

    /** @return array<int, Document> */
    public function findAll(): array;

    public function save(Document $document): Document;

    public function delete(DocumentId $id): bool;

    /**
     * @return array{data: array<int, Document>, current_page: int, from: int, last_page: int, path: string, per_page: int, to: int, total: int}
     */
    public function search(?int $followUpFileId, ?string $type, ?string $fromDate, ?string $toDate, ?int $portCallId, int $page, int $perPage): array;
}
