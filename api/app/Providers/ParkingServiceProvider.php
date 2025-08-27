<?php

namespace App\Providers;

use App\Domain\Parking\Repositories\ParkingRepositoryInterface;
use App\Infrastructure\Persistence\Repositories\EloquentParkingRepository;
use App\Application\Parking\UseCases\CreateParkingUseCase;
use App\Application\Parking\UseCases\UpdateParkingUseCase;
use App\Application\Parking\UseCases\GetParkingUseCase;
use App\Application\Parking\UseCases\GetParkingsUseCase;
use App\Application\Parking\UseCases\DeleteParkingUseCase;
use Illuminate\Support\ServiceProvider;

class ParkingServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Bind repository interface to implementation
        $this->app->bind(ParkingRepositoryInterface::class, EloquentParkingRepository::class);
        
        // Bind UseCases
        $this->app->bind(CreateParkingUseCase::class, function ($app) {
            return new CreateParkingUseCase(
                $app->make(ParkingRepositoryInterface::class)
            );
        });
        
        $this->app->bind(UpdateParkingUseCase::class, function ($app) {
            return new UpdateParkingUseCase(
                $app->make(ParkingRepositoryInterface::class)
            );
        });
        
        $this->app->bind(GetParkingUseCase::class, function ($app) {
            return new GetParkingUseCase(
                $app->make(ParkingRepositoryInterface::class)
            );
        });
        
        $this->app->bind(GetParkingsUseCase::class, function ($app) {
            return new GetParkingsUseCase(
                $app->make(ParkingRepositoryInterface::class)
            );
        });
        
        $this->app->bind(DeleteParkingUseCase::class, function ($app) {
            return new DeleteParkingUseCase(
                $app->make(ParkingRepositoryInterface::class)
            );
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
