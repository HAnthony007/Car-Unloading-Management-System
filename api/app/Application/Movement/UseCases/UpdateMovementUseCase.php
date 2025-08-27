<?php

namespace App\Application\Movement\UseCases;

use App\Application\Movement\DTOs\UpdateMovementDTO;
use App\Domain\Movement\Entities\Movement as DomainMovement;
use App\Domain\Movement\Repositories\MovementRepositoryInterface;
use App\Domain\Movement\ValueObjects\MovementId;
use App\Domain\Movement\ValueObjects\VehicleLocation;
use Carbon\Carbon;

final class UpdateMovementUseCase
{
    public function __construct(private readonly MovementRepositoryInterface $repository) {}

    public function execute(UpdateMovementDTO $dto): DomainMovement
    {
        $existing = $this->repository->findById(new MovementId($dto->movementId));
        if (! $existing) {
            throw new \RuntimeException('Movement not found.');
        }

        $updated = new DomainMovement(
            movementId: $existing->getMovementId(),
            note: $dto->note ?? $existing->getNote(),
            timestamp: $dto->timestamp ? Carbon::parse($dto->timestamp) : $existing->getTimestamp(),
            from: $dto->from !== null ? new VehicleLocation($dto->from) : $existing->getFrom(),
            to: $dto->to !== null ? new VehicleLocation($dto->to) : $existing->getTo(),
            vehicleId: $existing->getVehicleId(),
            userId: $existing->getUserId(),
            createdAt: $existing->getCreatedAt(),
            updatedAt: $existing->getUpdatedAt(),
        );

        return $this->repository->save($updated);
    }
}
