<?php

namespace App\Providers;

use App\Application\Dock\UseCases\CreateDockUseCase;
use App\Application\Dock\UseCases\DeleteDockUseCase;
use App\Application\Dock\UseCases\GetDocksUseCase;
use App\Application\Dock\UseCases\GetDockUseCase;
use App\Application\Dock\UseCases\UpdateDockUseCase;
use App\Domain\Dock\Repositories\DockRepositoryInterface;
use App\Infrastructure\Persistence\Repositories\EloquentDockRepository;
use Illuminate\Support\ServiceProvider;

class DockServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(DockRepositoryInterface::class, EloquentDockRepository::class);

        $this->app->bind(CreateDockUseCase::class, fn ($app) => new CreateDockUseCase($app->make(DockRepositoryInterface::class)));
        $this->app->bind(UpdateDockUseCase::class, fn ($app) => new UpdateDockUseCase($app->make(DockRepositoryInterface::class)));
        $this->app->bind(GetDockUseCase::class, fn ($app) => new GetDockUseCase($app->make(DockRepositoryInterface::class)));
        $this->app->bind(GetDocksUseCase::class, fn ($app) => new GetDocksUseCase($app->make(DockRepositoryInterface::class)));
        $this->app->bind(DeleteDockUseCase::class, fn ($app) => new DeleteDockUseCase($app->make(DockRepositoryInterface::class)));
    }

    public function boot(): void {}
}
