<?php

namespace App\Application\Dock\UseCases;

use App\Domain\Dock\Entities\Dock;
use App\Domain\Dock\Repositories\DockRepositoryInterface;

final class GetDocksUseCase
{
    public function __construct(private readonly DockRepositoryInterface $dockRepository) {}

    /**
     * @return array<int, Dock>
     */
    public function execute(): array
    {
        return $this->dockRepository->findAll();
    }
}
