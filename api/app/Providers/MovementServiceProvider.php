<?php

namespace App\Providers;

use App\Application\Movement\UseCases\CreateMovementUseCase;
use App\Application\Movement\UseCases\DeleteMovementUseCase;
use App\Application\Movement\UseCases\GetMovementUseCase;
use App\Application\Movement\UseCases\SearchMovementsUseCase;
use App\Application\Movement\UseCases\UpdateMovementUseCase;
use App\Domain\Movement\Repositories\MovementRepositoryInterface;
use App\Domain\User\Repositories\UserRepositoryInterface;
use App\Domain\Vehicle\Repositories\VehicleRepositoryInterface;
use App\Infrastructure\Persistence\Repositories\EloquentMovementRepository;
use Illuminate\Support\ServiceProvider;

class MovementServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(MovementRepositoryInterface::class, EloquentMovementRepository::class);

        $this->app->bind(CreateMovementUseCase::class, fn ($app) => new CreateMovementUseCase(
            $app->make(MovementRepositoryInterface::class),
            $app->make(VehicleRepositoryInterface::class),
            $app->make(UserRepositoryInterface::class),
        ));
        $this->app->bind(UpdateMovementUseCase::class, fn ($app) => new UpdateMovementUseCase($app->make(MovementRepositoryInterface::class)));
        $this->app->bind(GetMovementUseCase::class, fn ($app) => new GetMovementUseCase($app->make(MovementRepositoryInterface::class)));
        $this->app->bind(DeleteMovementUseCase::class, fn ($app) => new DeleteMovementUseCase($app->make(MovementRepositoryInterface::class)));
        $this->app->bind(SearchMovementsUseCase::class, fn ($app) => new SearchMovementsUseCase($app->make(MovementRepositoryInterface::class)));
    }

    public function boot(): void {}
}
