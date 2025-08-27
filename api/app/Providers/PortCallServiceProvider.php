<?php

namespace App\Providers;

use App\Application\PortCall\UseCases\CreatePortCallUseCase;
use App\Application\PortCall\UseCases\DeletePortCallUseCase;
use App\Application\PortCall\UseCases\GetPortCallsUseCase;
use App\Application\PortCall\UseCases\GetPortCallUseCase;
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
        $this->app->bind(DeletePortCallUseCase::class, fn ($app) => new DeletePortCallUseCase($app->make(PortCallRepositoryInterface::class)));
    }

    public function boot(): void {}
}
