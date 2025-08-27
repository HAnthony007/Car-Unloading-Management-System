<?php

namespace App\Application\Document\UseCases;

use App\Domain\Document\Repositories\DocumentRepositoryInterface;
use App\Domain\Document\ValueObjects\DocumentId;

final class DeleteDocumentUseCase
{
    public function __construct(private readonly DocumentRepositoryInterface $repo) {}

    public function execute(int $id): void
    {
        $deleted = $this->repo->delete(new DocumentId($id));
        if (! $deleted) {
            throw new \RuntimeException('Document not found.');
        }
    }
}
