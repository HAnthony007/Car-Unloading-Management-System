<?php

namespace App\Application\Photo\UseCases;

use App\Domain\Photo\Repositories\PhotoRepositoryInterface;
use App\Domain\Photo\ValueObjects\PhotoId;

final class DeletePhotoUseCase
{
    public function __construct(private readonly PhotoRepositoryInterface $repo) {}

    public function execute(int $id): void
    {
        $deleted = $this->repo->delete(new PhotoId($id));
        if (! $deleted) {
            throw new \RuntimeException('Photo not found.');
        }
    }
}
