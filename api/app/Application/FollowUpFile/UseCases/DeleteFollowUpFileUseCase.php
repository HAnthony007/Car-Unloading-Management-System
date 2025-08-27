<?php

namespace App\Application\FollowUpFile\UseCases;

use App\Domain\FollowUpFile\Repositories\FollowUpFileRepositoryInterface;
use App\Domain\FollowUpFile\ValueObjects\FollowUpFileId;

final class DeleteFollowUpFileUseCase
{
    public function __construct(private readonly FollowUpFileRepositoryInterface $repository) {}

    public function execute(int $id): void
    {
        $deleted = $this->repository->delete(new FollowUpFileId($id));
        if (! $deleted) {
            throw new \RuntimeException('FollowUpFile not found.');
        }
    }
}
