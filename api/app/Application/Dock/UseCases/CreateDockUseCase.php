<?php

namespace App\Application\Dock\UseCases;

use App\Application\Dock\DTOs\CreateDockDTO;
use App\Domain\Dock\Entities\Dock;
use App\Domain\Dock\Repositories\DockRepositoryInterface;
use App\Domain\Dock\ValueObjects\DockName;
use App\Domain\Dock\ValueObjects\Location;

final class CreateDockUseCase
{
    public function __construct(private readonly DockRepositoryInterface $dockRepository) {}

    public function execute(CreateDockDTO $dto): Dock
    {
        $dock = new Dock(
            dockId: null,
            dockName: new DockName($dto->dockName),
            location: new Location($dto->location),
        );

        return $this->dockRepository->save($dock);
    }
}
