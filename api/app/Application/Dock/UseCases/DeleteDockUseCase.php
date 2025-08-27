<?php

namespace App\Application\Dock\UseCases;

use App\Domain\Dock\Repositories\DockRepositoryInterface;
use App\Domain\Dock\ValueObjects\DockId;

final class DeleteDockUseCase
{
    public function __construct(private readonly DockRepositoryInterface $dockRepository) {}

    public function execute(int $dockId): void
    {
        $id = new DockId($dockId);
        $success = $this->dockRepository->delete($id);
        if (! $success) {
            throw new \RuntimeException('Dock not found');
        }
    }
}
