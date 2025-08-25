<?php

namespace App\Application\Parking\UseCases;

use App\Application\Parking\DTOs\CreateParkingDTO;
use App\Models\Parking;

final class CreateParkingUseCase
{
    public function execute(CreateParkingDTO $dto): Parking
    {
        return Parking::create($dto->toArray());
    }
}
