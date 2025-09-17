<?php

namespace App\Application\Parking\UseCases;

use App\Application\Parking\DTOs\UpdateParkingDTO;
use App\Domain\Parking\Entities\Parking;
use App\Domain\Parking\Repositories\ParkingRepositoryInterface;
use App\Domain\Parking\ValueObjects\Capacity;
use App\Domain\Parking\ValueObjects\Location;
use App\Domain\Parking\ValueObjects\ParkingId;
use App\Domain\Parking\ValueObjects\ParkingName;
use App\Domain\Parking\ValueObjects\ParkingNumber;

final class UpdateParkingUseCase
{
    public function __construct(private readonly ParkingRepositoryInterface $parkingRepository) {}

    public function execute(UpdateParkingDTO $dto): Parking
    {
        $parkingId = new ParkingId($dto->parkingId);
        $existingParking = $this->parkingRepository->findById($parkingId);

        if (! $existingParking) {
            throw new \RuntimeException('Parking not found');
        }

        // Vérification spéciale pour Mahasarika parking
        $newParkingName = $dto->parkingName ?? $existingParking->getParkingName()->getValue();
        $newParkingNumber = $dto->parkingNumber ?? $existingParking->getParkingNumber()?->getValue();

        // Validation for Mahasarika parking
        $isMahasarika = $dto->parkingId === 1 || $newParkingName === 'Mahasarika';
        $hasNoParkingNumber = $newParkingNumber === null;

        if ($isMahasarika && $hasNoParkingNumber) {
            throw new \InvalidArgumentException('Parking number is required for Mahasarika parking.');
        }

        // Only continue if validation passes
        $parkingName = $dto->parkingName !== null
            ? new ParkingName($dto->parkingName)
            : $existingParking->getParkingName();

        $location = $dto->location !== null
            ? new Location($dto->location)
            : $existingParking->getLocation();

        $capacity = $dto->capacity !== null
            ? new Capacity($dto->capacity)
            : $existingParking->getCapacity();

        $parkingNumber = $dto->parkingNumber !== null
            ? new ParkingNumber($dto->parkingNumber)
            : $existingParking->getParkingNumber();

        $latitude = $dto->latitude !== null ? $dto->latitude : $existingParking->getLatitude();
        $longitude = $dto->longitude !== null ? $dto->longitude : $existingParking->getLongitude();

        // Créer une nouvelle entité avec les valeurs mises à jour
        $updatedParking = new Parking(
            parkingId: $existingParking->getParkingId(),
            parkingName: $parkingName,
            location: $location,
            capacity: $capacity,
            parkingNumber: $parkingNumber,
            latitude: $latitude,
            longitude: $longitude,
            createdAt: $existingParking->getCreatedAt(),
            updatedAt: now()
        );

        return $this->parkingRepository->save($updatedParking);
    }
}
