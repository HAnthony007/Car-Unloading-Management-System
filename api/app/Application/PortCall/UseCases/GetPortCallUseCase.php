<?php

namespace App\Application\PortCall\UseCases;

use App\Domain\PortCall\Entities\PortCall;
use App\Domain\PortCall\Repositories\PortCallRepositoryInterface;
use App\Domain\PortCall\ValueObjects\PortCallId;

final class GetPortCallUseCase
{
    public function __construct(private readonly PortCallRepositoryInterface $repository) {}

    public function execute(int $id): PortCall
    {
        $found = $this->repository->findById(new PortCallId($id));
        if (! $found) {
            throw new \RuntimeException('Port call not found');
        }

        return $found;
    }
}
