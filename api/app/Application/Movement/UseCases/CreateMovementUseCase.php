<?php

namespace App\Application\Movement\UseCases;

use App\Application\Movement\DTOs\CreateMovementDTO;
use App\Domain\Movement\Entities\Movement as DomainMovement;
use App\Domain\Movement\Repositories\MovementRepositoryInterface;
use App\Domain\Movement\ValueObjects\VehicleLocation;
use App\Domain\Parking\Repositories\ParkingRepositoryInterface;
use App\Domain\User\Repositories\UserRepositoryInterface;
use App\Domain\User\ValueObjects\UserId;
use App\Domain\Vehicle\Repositories\VehicleRepositoryInterface;
use App\Domain\Vehicle\ValueObjects\VehicleId;
use Carbon\Carbon;

final class CreateMovementUseCase
{
    public function __construct(
        private readonly MovementRepositoryInterface $movementRepository,
        private readonly VehicleRepositoryInterface $vehicleRepository,
        private readonly UserRepositoryInterface $userRepository,
        private readonly ParkingRepositoryInterface $parkingRepository,
    ) {}

    public function execute(CreateMovementDTO $dto): DomainMovement
    {
        // Validate vehicle & user existence via repositories
        if (! $this->vehicleRepository->findById(new VehicleId($dto->vehicleId))) {
            throw new \RuntimeException('Vehicle not found.');
        }
        if (! $this->userRepository->findById(new UserId($dto->userId))) {
            throw new \RuntimeException('User not found.');
        }

        $toName = $dto->to;

        // Capacity check: if moving into a known parking, ensure we don't exceed capacity
        if ($toName) {
            $parking = $this->parkingRepository->findByName($toName);
            if ($parking) {
                $capacity = $parking->getCapacity()->getValue();
                $currentVehicleIds = $this->movementRepository->findVehicleIdsAtLocation($toName);
                $currentCount = count($currentVehicleIds);

                // Determine if this vehicle is already counted at destination
                $existingMovements = $this->movementRepository->findByVehicle(new VehicleId($dto->vehicleId));
                $alreadyAtDestination = false;
                if (! empty($existingMovements)) {
                    $latest = $existingMovements[0];
                    $alreadyAtDestination = ($latest->getTo()->getValue() === $toName);
                }

                $effectiveAfter = $alreadyAtDestination ? $currentCount : $currentCount + 1;
                if ($effectiveAfter > $capacity) {
                    throw new \RuntimeException('Parking capacity exceeded for '.$toName.'.');
                }
            }
        }
        $parkingNumber = $toName === 'Mahasarika' ? $dto->parkingNumber : null;

        $entity = new DomainMovement(
            movementId: null,
            note: $dto->note,
            timestamp: Carbon::parse($dto->timestamp),
            from: new VehicleLocation($dto->from),
            to: new VehicleLocation($dto->to),
            vehicleId: new VehicleId($dto->vehicleId),
            userId: new UserId($dto->userId),
            parkingNumber: $parkingNumber,
        );

        return $this->movementRepository->save($entity);
    }
}
