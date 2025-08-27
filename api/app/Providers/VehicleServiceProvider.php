<?php

namespace App\Providers;

use App\Application\Vehicle\UseCases\CreateVehicleUseCase;
use App\Application\Vehicle\UseCases\DeleteVehicleUseCase;
use App\Application\Vehicle\UseCases\GetVehicleUseCase;
use App\Application\Vehicle\UseCases\GetVehiclesUseCase;
use App\Application\Vehicle\UseCases\UpdateVehicleUseCase;
use App\Application\Vehicle\UseCases\SearchVehiclesUseCase;
use App\Domain\Discharge\Repositories\DischargeRepositoryInterface;
use App\Domain\Vehicle\Repositories\VehicleRepositoryInterface;
use App\Infrastructure\Persistence\Repositories\EloquentVehicleRepository;
use Illuminate\Support\ServiceProvider;

class VehicleServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(VehicleRepositoryInterface::class, EloquentVehicleRepository::class);

        $this->app->bind(CreateVehicleUseCase::class, fn ($app) => new CreateVehicleUseCase(
            $app->make(VehicleRepositoryInterface::class),
            $app->make(DischargeRepositoryInterface::class),
        ));
        $this->app->bind(UpdateVehicleUseCase::class, fn ($app) => new UpdateVehicleUseCase($app->make(VehicleRepositoryInterface::class)));
        $this->app->bind(GetVehicleUseCase::class, fn ($app) => new GetVehicleUseCase($app->make(VehicleRepositoryInterface::class)));
        $this->app->bind(GetVehiclesUseCase::class, fn ($app) => new GetVehiclesUseCase($app->make(VehicleRepositoryInterface::class)));
        $this->app->bind(DeleteVehicleUseCase::class, fn ($app) => new DeleteVehicleUseCase($app->make(VehicleRepositoryInterface::class)));
    $this->app->bind(SearchVehiclesUseCase::class, fn ($app) => new SearchVehiclesUseCase($app->make(VehicleRepositoryInterface::class)));
    }

    public function boot(): void {}
}
