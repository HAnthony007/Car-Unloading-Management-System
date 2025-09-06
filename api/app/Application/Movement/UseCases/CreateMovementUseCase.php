<?php

namespace App\Application\Movement\UseCases;

use App\Application\Movement\DTOs\CreateMovementDTO;
use App\Domain\Discharge\Repositories\DischargeRepositoryInterface;
use App\Domain\Discharge\ValueObjects\DischargeId;
use App\Domain\Movement\Entities\Movement as DomainMovement;
use App\Domain\Movement\Repositories\MovementRepositoryInterface;
use App\Domain\Movement\ValueObjects\VehicleLocation;
use App\Domain\Parking\Repositories\ParkingRepositoryInterface;
use App\Domain\User\Repositories\UserRepositoryInterface;
use App\Domain\User\ValueObjects\UserId;
use Carbon\Carbon;

final class CreateMovementUseCase
{
    public function __construct(
        private readonly MovementRepositoryInterface $movementRepository,
        private readonly DischargeRepositoryInterface $dischargeRepository,
        private readonly UserRepositoryInterface $userRepository,
        private readonly ParkingRepositoryInterface $parkingRepository,
    ) {}

    public function execute(CreateMovementDTO $dto): DomainMovement
    {
        // Validate discharge & user existence via repositories
        if (! $this->dischargeRepository->findById(new DischargeId($dto->dischargeId))) {
            throw new \RuntimeException('Discharge not found.');
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
                $currentDischargeIds = $this->movementRepository->findDischargeIdsAtLocation($toName);
                $currentCount = count($currentDischargeIds);
                // Simplified: each discharge counts once
                $effectiveAfter = $currentCount + 1;
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
            dischargeId: new DischargeId($dto->dischargeId),
            userId: new UserId($dto->userId),
            parkingNumber: $parkingNumber,
        );

        return $this->movementRepository->save($entity);
    }
}
