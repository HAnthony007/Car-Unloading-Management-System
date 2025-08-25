<?php

namespace App\Application\Parking\UseCases;

use App\Models\Parking;

final class DeleteParkingUseCase
{
    public function execute(int $parkingId): void
    {
        $parking = Parking::find($parkingId);
        
        if (!$parking) {
            throw new \RuntimeException('Parking not found');
        }
        
        $parking->delete();
    }
}
