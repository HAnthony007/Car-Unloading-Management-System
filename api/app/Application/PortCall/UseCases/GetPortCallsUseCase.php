<?php

namespace App\Application\PortCall\UseCases;

use App\Domain\PortCall\Entities\PortCall;
use App\Domain\PortCall\Repositories\PortCallRepositoryInterface;

final class GetPortCallsUseCase
{
    public function __construct(private readonly PortCallRepositoryInterface $repository) {}

    /**
     * @return array<int, PortCall>
     */
    public function execute(): array
    {
        return $this->repository->findAll();
    }
}
