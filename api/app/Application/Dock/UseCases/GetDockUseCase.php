<?php

namespace App\Application\Dock\UseCases;

use App\Domain\Dock\Entities\Dock;
use App\Domain\Dock\Repositories\DockRepositoryInterface;
use App\Domain\Dock\ValueObjects\DockId;

final class GetDockUseCase
{
    public function __construct(private readonly DockRepositoryInterface $dockRepository) {}

    public function execute(int $dockId): Dock
    {
        $id = new DockId($dockId);
        $dock = $this->dockRepository->findById($id);
        if (!$dock) {
            throw new \RuntimeException('Dock not found');
        }
        return $dock;
    }
}
