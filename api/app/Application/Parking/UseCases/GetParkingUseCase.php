<?php

namespace App\Application\Parking\UseCases;

use App\Models\Parking;

final class GetParkingUseCase
{
    public function execute(int $parkingId): Parking
    {
        $parking = Parking::find($parkingId);
        
        if (!$parking) {
            throw new \RuntimeException('Parking not found');
        }
        
        return $parking;
    }
}
