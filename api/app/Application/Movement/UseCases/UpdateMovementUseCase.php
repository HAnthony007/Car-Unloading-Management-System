<?php

namespace App\Application\Movement\UseCases;

use App\Application\Movement\DTOs\UpdateMovementDTO;
use App\Domain\Movement\Entities\Movement as DomainMovement;
use App\Domain\Movement\Repositories\MovementRepositoryInterface;
use App\Domain\Movement\ValueObjects\MovementId;
use App\Domain\Movement\ValueObjects\VehicleLocation;
use App\Domain\Parking\Repositories\ParkingRepositoryInterface;
use Carbon\Carbon;

final class UpdateMovementUseCase
{
    public function __construct(
        private readonly MovementRepositoryInterface $repository,
        private readonly ParkingRepositoryInterface $parkingRepository
    ) {}

    public function execute(UpdateMovementDTO $dto): DomainMovement
    {
        $existing = $this->repository->findById(new MovementId($dto->movementId));
        if (! $existing) {
            throw new \RuntimeException('Movement not found.');
        }

        $newTo = $dto->to !== null ? $dto->to : $existing->getTo()->getValue();

        // Capacity check if destination changes into a known parking
        if ($dto->to !== null && $dto->to !== $existing->getTo()->getValue()) {
            $parking = $this->parkingRepository->findByName($newTo);
            if ($parking) {
                $capacity = $parking->getCapacity()->getValue();
                $currentDischargeIds = $this->repository->findDischargeIdsAtLocation($newTo);
                $currentCount = count($currentDischargeIds);
                $effectiveAfter = $currentCount + 1; // this discharge moves into this parking
                if ($effectiveAfter > $capacity) {
                    throw new \RuntimeException('Parking capacity exceeded for '.$newTo.'.');
                }
            }
        }
        $newParkingNumber = $newTo === 'Mahasarika'
            ? ($dto->parkingNumber ?? $existing->getParkingNumber())
            : null;

        $updated = new DomainMovement(
            movementId: $existing->getMovementId(),
            note: $dto->note ?? $existing->getNote(),
            timestamp: $dto->timestamp ? Carbon::parse($dto->timestamp) : $existing->getTimestamp(),
            from: $dto->from !== null ? new VehicleLocation($dto->from) : $existing->getFrom(),
            to: $dto->to !== null ? new VehicleLocation($dto->to) : $existing->getTo(),
            dischargeId: $existing->getDischargeId(),
            userId: $existing->getUserId(),
            parkingNumber: $newParkingNumber,
            createdAt: $existing->getCreatedAt(),
            updatedAt: $existing->getUpdatedAt(),
        );

        return $this->repository->save($updated);
    }
}
