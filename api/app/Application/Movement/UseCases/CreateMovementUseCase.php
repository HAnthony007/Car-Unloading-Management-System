<?php

namespace App\Application\Movement\UseCases;

use App\Application\Movement\DTOs\CreateMovementDTO;
use App\Domain\Movement\Entities\Movement as DomainMovement;
use App\Domain\Movement\Repositories\MovementRepositoryInterface;
use App\Domain\Movement\ValueObjects\VehicleLocation;
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

        $entity = new DomainMovement(
            movementId: null,
            note: $dto->note,
            timestamp: Carbon::parse($dto->timestamp),
            from: new VehicleLocation($dto->from),
            to: new VehicleLocation($dto->to),
            vehicleId: new VehicleId($dto->vehicleId),
            userId: new UserId($dto->userId),
        );

        return $this->movementRepository->save($entity);
    }
}
