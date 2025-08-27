<?php

namespace App\Application\Document\UseCases;

use App\Application\Document\DTOs\CreateDocumentDTO;
use App\Domain\Document\Entities\Document;
use App\Domain\Document\Repositories\DocumentRepositoryInterface;
use App\Domain\Document\ValueObjects\DocumentType;
use App\Domain\FollowUpFile\ValueObjects\FollowUpFileId;
use Carbon\Carbon;

final class CreateDocumentUseCase
{
    public function __construct(private readonly DocumentRepositoryInterface $repo) {}

    public function execute(CreateDocumentDTO $dto): Document
    {
        $entity = new Document(
            documentId: null,
            documentPath: $dto->documentPath,
            documentDescription: $dto->documentDescription,
            type: new DocumentType($dto->type),
            uploadedAt: new Carbon($dto->uploadedAt),
            followUpFileId: new FollowUpFileId($dto->followUpFileId),
        );

        return $this->repo->save($entity);
    }
}
