<?php

namespace App\Providers;

use App\Application\Vessel\UseCases\CreateVesselUseCase;
use App\Application\Vessel\UseCases\DeleteVesselUseCase;
use App\Application\Vessel\UseCases\GetVesselUseCase;
use App\Application\Vessel\UseCases\GetVesselsUseCase;
use App\Application\Vessel\UseCases\UpdateVesselUseCase;
use App\Domain\Vessel\Repositories\VesselRepositoryInterface;
use App\Infrastructure\Persistence\Repositories\EloquentVesselRepository;
use Illuminate\Support\ServiceProvider;

class VesselServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(VesselRepositoryInterface::class, EloquentVesselRepository::class);

        $this->app->bind(CreateVesselUseCase::class, fn ($app) => new CreateVesselUseCase($app->make(VesselRepositoryInterface::class)));
        $this->app->bind(UpdateVesselUseCase::class, fn ($app) => new UpdateVesselUseCase($app->make(VesselRepositoryInterface::class)));
        $this->app->bind(GetVesselUseCase::class, fn ($app) => new GetVesselUseCase($app->make(VesselRepositoryInterface::class)));
        $this->app->bind(GetVesselsUseCase::class, fn ($app) => new GetVesselsUseCase($app->make(VesselRepositoryInterface::class)));
        $this->app->bind(DeleteVesselUseCase::class, fn ($app) => new DeleteVesselUseCase($app->make(VesselRepositoryInterface::class)));
    }

    public function boot(): void {}
}
