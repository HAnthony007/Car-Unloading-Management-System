<?php

namespace App\Application\Parking\UseCases;

use App\Models\Parking;
use Illuminate\Database\Eloquent\Collection;

final class GetParkingsUseCase
{
    public function execute(): Collection
    {
        return Parking::all();
    }
}
