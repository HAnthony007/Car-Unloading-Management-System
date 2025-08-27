<?php

namespace App\Application\Dock\UseCases;

use App\Application\Dock\DTOs\UpdateDockDTO;
use App\Domain\Dock\Entities\Dock;
use App\Domain\Dock\Repositories\DockRepositoryInterface;
use App\Domain\Dock\ValueObjects\DockId;
use App\Domain\Dock\ValueObjects\DockName;
use App\Domain\Dock\ValueObjects\Location;

final class UpdateDockUseCase
{
    public function __construct(private readonly DockRepositoryInterface $dockRepository) {}

    public function execute(UpdateDockDTO $dto): Dock
    {
        $dockId = new DockId($dto->dockId);
        $existing = $this->dockRepository->findById($dockId);
        if (! $existing) {
            throw new \RuntimeException('Dock not found');
        }

        $dockName = $dto->dockName !== null ? new DockName($dto->dockName) : $existing->getDockName();
        $location = $dto->location !== null ? new Location($dto->location) : $existing->getLocation();

        $updated = new Dock(
            dockId: $existing->getDockId(),
            dockName: $dockName,
            location: $location,
            createdAt: $existing->getCreatedAt(),
            updatedAt: now(),
        );

        return $this->dockRepository->save($updated);
    }
}
