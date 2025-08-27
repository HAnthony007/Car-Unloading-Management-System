<?php

namespace App\Application\Photo\UseCases;

use App\Domain\Photo\Repositories\PhotoRepositoryInterface;
use App\Domain\Photo\ValueObjects\PhotoId;

final class GetPhotoUseCase
{
    public function __construct(private readonly PhotoRepositoryInterface $repo) {}

    public function execute(int $id): \App\Domain\Photo\Entities\Photo
    {
        $entity = $this->repo->findById(new PhotoId($id));
        if (! $entity) {
            throw new \RuntimeException('Photo not found.');
        }

        return $entity;
    }
}
