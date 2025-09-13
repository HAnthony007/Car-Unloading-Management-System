<?php

namespace App\Providers;

use App\Application\PortCall\UseCases\CheckVehicleInPortCallUseCase;
use App\Application\PortCall\UseCases\CreatePortCallUseCase;
use App\Application\PortCall\UseCases\DeletePortCallUseCase;
use App\Application\PortCall\UseCases\GetPortCallsUseCase;
use App\Application\PortCall\UseCases\GetPortCallUseCase;
use App\Application\PortCall\UseCases\GetPortCallVehiclesUseCase;
use App\Application\PortCall\UseCases\SearchPortCallsUseCase;
use App\Application\PortCall\UseCases\SearchPortCallVehiclesUseCase;
use App\Application\PortCall\UseCases\UpdatePortCallUseCase;
use App\Domain\PortCall\Repositories\PortCallRepositoryInterface;
use App\Infrastructure\Persistence\Repositories\EloquentPortCallRepository;
use Illuminate\Support\ServiceProvider;

class PortCallServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(PortCallRepositoryInterface::class, EloquentPortCallRepository::class);

        $this->app->bind(CreatePortCallUseCase::class, fn ($app) => new CreatePortCallUseCase($app->make(PortCallRepositoryInterface::class)));
        $this->app->bind(UpdatePortCallUseCase::class, fn ($app) => new UpdatePortCallUseCase($app->make(PortCallRepositoryInterface::class)));
        $this->app->bind(GetPortCallUseCase::class, fn ($app) => new GetPortCallUseCase($app->make(PortCallRepositoryInterface::class)));
        $this->app->bind(GetPortCallsUseCase::class, fn ($app) => new GetPortCallsUseCase($app->make(PortCallRepositoryInterface::class)));
        $this->app->bind(SearchPortCallsUseCase::class, fn ($app) => new SearchPortCallsUseCase($app->make(PortCallRepositoryInterface::class)));
        $this->app->bind(DeletePortCallUseCase::class, fn ($app) => new DeletePortCallUseCase($app->make(PortCallRepositoryInterface::class)));
        // Vehicles by port call depends on VehicleRepositoryInterface (bound in VehicleServiceProvider)
        $this->app->bind(GetPortCallVehiclesUseCase::class, fn ($app) => new GetPortCallVehiclesUseCase($app->make(\App\Domain\Vehicle\Repositories\VehicleRepositoryInterface::class)));
        $this->app->bind(SearchPortCallVehiclesUseCase::class, fn ($app) => new SearchPortCallVehiclesUseCase($app->make(\App\Domain\Vehicle\Repositories\VehicleRepositoryInterface::class)));
        $this->app->bind(CheckVehicleInPortCallUseCase::class, fn ($app) => new CheckVehicleInPortCallUseCase(
            $app->make(\App\Domain\Vehicle\Repositories\VehicleRepositoryInterface::class),
            $app->make(\App\Domain\Discharge\Repositories\DischargeRepositoryInterface::class),
        ));
    }

    public function boot(): void {}
}
