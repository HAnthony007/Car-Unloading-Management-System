<?php

namespace App\Application\Parking\UseCases;

use App\Application\Parking\DTOs\UpdateParkingDTO;
use App\Models\Parking;

final class UpdateParkingUseCase
{
    public function execute(UpdateParkingDTO $dto): Parking
    {
        $parking = Parking::find($dto->parkingId);
        
        if (!$parking) {
            throw new \RuntimeException('Parking not found');
        }
        
        $updateData = $dto->toArray();
        if (!empty($updateData)) {
            $parking->update($updateData);
        }
        
        return $parking->fresh();
    }
}
