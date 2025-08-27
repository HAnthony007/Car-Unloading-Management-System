<?php

namespace App\Application\Document\UseCases;

use App\Application\Document\DTOs\UpdateDocumentDTO;
use App\Domain\Document\Entities\Document;
use App\Domain\Document\Repositories\DocumentRepositoryInterface;
use App\Domain\Document\ValueObjects\DocumentId;
use App\Domain\Document\ValueObjects\DocumentType;
use App\Domain\FollowUpFile\ValueObjects\FollowUpFileId;
use Carbon\Carbon;

final class UpdateDocumentUseCase
{
    public function __construct(private readonly DocumentRepositoryInterface $repo) {}

    public function execute(UpdateDocumentDTO $dto): Document
    {
        $existing = $this->repo->findById(new DocumentId($dto->documentId));
        if (! $existing) {
            throw new \RuntimeException('Document not found.');
        }

        $entity = new Document(
            documentId: new DocumentId($dto->documentId),
            documentPath: $dto->documentPath ?? $existing->getDocumentPath(),
            documentDescription: $dto->documentDescription ?? $existing->getDocumentDescription(),
            type: new DocumentType($dto->type ?? $existing->getType()->getValue()),
            uploadedAt: new Carbon($dto->uploadedAt ?? $existing->getUploadedAt()->toISOString()),
            followUpFileId: new FollowUpFileId($dto->followUpFileId ?? $existing->getFollowUpFileId()->getValue()),
            createdAt: $existing->getCreatedAt(),
            updatedAt: $existing->getUpdatedAt(),
        );

        return $this->repo->save($entity);
    }
}
