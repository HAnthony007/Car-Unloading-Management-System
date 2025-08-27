<?php

namespace App\Application\PortCall\UseCases;

use App\Domain\PortCall\Repositories\PortCallRepositoryInterface;
use App\Domain\PortCall\ValueObjects\PortCallId;

final class DeletePortCallUseCase
{
    public function __construct(private readonly PortCallRepositoryInterface $repository) {}

    public function execute(int $id): void
    {
        $deleted = $this->repository->delete(new PortCallId($id));
        if (! $deleted) {
            throw new \RuntimeException('Port call not found');
        }
    }
}
