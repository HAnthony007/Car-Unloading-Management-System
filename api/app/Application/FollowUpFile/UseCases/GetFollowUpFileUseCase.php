<?php

namespace App\Application\FollowUpFile\UseCases;

use App\Domain\FollowUpFile\Entities\FollowUpFile;
use App\Domain\FollowUpFile\Repositories\FollowUpFileRepositoryInterface;
use App\Domain\FollowUpFile\ValueObjects\FollowUpFileId;

final class GetFollowUpFileUseCase
{
    public function __construct(private readonly FollowUpFileRepositoryInterface $repository) {}

    public function execute(int $id): FollowUpFile
    {
        $entity = $this->repository->findById(new FollowUpFileId($id));
        if (! $entity) {
            throw new \RuntimeException('FollowUpFile not found.');
        }

        return $entity;
    }
}
