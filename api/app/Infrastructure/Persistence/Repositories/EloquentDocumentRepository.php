<?php

namespace App\Infrastructure\Persistence\Repositories;

use App\Domain\Document\Entities\Document as DomainDocument;
use App\Domain\Document\Repositories\DocumentRepositoryInterface;
use App\Domain\Document\ValueObjects\DocumentId;
use App\Domain\Document\ValueObjects\DocumentType;
use App\Domain\FollowUpFile\ValueObjects\FollowUpFileId;
use App\Models\Document as EloquentDocument;
use Carbon\Carbon;

final class EloquentDocumentRepository implements DocumentRepositoryInterface
{
    public function findById(DocumentId $id): ?DomainDocument
    {
        $e = EloquentDocument::find($id->getValue());

        return $e ? $this->toDomain($e) : null;
    }

    public function findAll(): array
    {
        return EloquentDocument::orderByDesc('uploaded_at')->get()->map(fn ($e) => $this->toDomain($e))->toArray();
    }

    public function save(DomainDocument $d): DomainDocument
    {
        $e = $d->getDocumentId() ? EloquentDocument::find($d->getDocumentId()->getValue()) : new EloquentDocument;
        if (! $e) {
            $e = new EloquentDocument;
        }

        $e->document_path = $d->getDocumentPath();
        $e->document_description = $d->getDocumentDescription();
        $e->type = $d->getType()->getValue();
        $e->uploaded_at = $d->getUploadedAt();
        $e->follow_up_file_id = $d->getFollowUpFileId()->getValue();
        $e->save();

        return $this->toDomain($e);
    }

    public function delete(DocumentId $id): bool
    {
        $e = EloquentDocument::find($id->getValue());
        if (! $e) {
            return false;
        }

        return (bool) $e->delete();
    }

    public function search(?int $followUpFileId, ?string $type, ?string $fromDate, ?string $toDate, int $page, int $perPage): array
    {
        $query = EloquentDocument::query();

        if ($followUpFileId) {
            $query->where('follow_up_file_id', $followUpFileId);
        }
        if ($type) {
            $query->where('type', $type);
        }
        if ($fromDate) {
            $query->where('uploaded_at', '>=', Carbon::parse($fromDate));
        }
        if ($toDate) {
            $query->where('uploaded_at', '<=', Carbon::parse($toDate));
        }

        $paginator = $query->orderByDesc('uploaded_at')->paginate($perPage, ['*'], 'page', $page);

        return [
            'data' => collect($paginator->items())->map(fn ($e) => $this->toDomain($e))->toArray(),
            'current_page' => $paginator->currentPage(),
            'from' => $paginator->firstItem() ?? 0,
            'last_page' => $paginator->lastPage(),
            'path' => $paginator->path(),
            'per_page' => $paginator->perPage(),
            'to' => $paginator->lastItem() ?? 0,
            'total' => $paginator->total(),
        ];
    }

    private function toDomain(EloquentDocument $e): DomainDocument
    {
        return new DomainDocument(
            documentId: new DocumentId($e->document_id),
            documentPath: $e->document_path,
            documentDescription: $e->document_description,
            type: new DocumentType($e->type),
            uploadedAt: new Carbon($e->uploaded_at),
            followUpFileId: new FollowUpFileId($e->follow_up_file_id),
            createdAt: $e->created_at,
            updatedAt: $e->updated_at,
        );
    }
}
