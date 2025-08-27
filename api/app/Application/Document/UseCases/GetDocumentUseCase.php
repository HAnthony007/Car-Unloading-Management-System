<?php

namespace App\Application\Document\UseCases;

use App\Domain\Document\Repositories\DocumentRepositoryInterface;
use App\Domain\Document\ValueObjects\DocumentId;

final class GetDocumentUseCase
{
    public function __construct(private readonly DocumentRepositoryInterface $repo) {}

    public function execute(int $id): \App\Domain\Document\Entities\Document
    {
        $entity = $this->repo->findById(new DocumentId($id));
        if (! $entity) {
            throw new \RuntimeException('Document not found.');
        }

        return $entity;
    }
}
