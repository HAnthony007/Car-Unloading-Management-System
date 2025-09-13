<?php

namespace App\Providers;

use App\Application\Inspection\UseCases\GetDischargeInspectionUseCase;
use App\Application\Inspection\UseCases\StartVehicleInspectionUseCase;
use App\Domain\Survey\Repositories\SurveyRepositoryInterface;
use App\Domain\SurveyCheckpoint\Repositories\SurveyCheckpointRepositoryInterface;
use Illuminate\Support\ServiceProvider;

class InspectionServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // StartVehicleInspectionUseCase already auto-resolves via constructor type-hints (uses Eloquent models directly)
        $this->app->bind(GetDischargeInspectionUseCase::class, function ($app) {
            return new GetDischargeInspectionUseCase(
                $app->make(SurveyRepositoryInterface::class),
                $app->make(SurveyCheckpointRepositoryInterface::class),
            );
        });
    }
}
