<?php

namespace App\Providers;

use App\Application\Discharge\UseCases\CreateDischargeUseCase;
use App\Application\Discharge\UseCases\DeleteDischargeUseCase;
use App\Application\Discharge\UseCases\GetDischargesByPortCallUseCase;
use App\Application\Discharge\UseCases\GetDischargesUseCase;
use App\Application\Discharge\UseCases\GetDischargeUseCase;
use App\Application\Discharge\UseCases\UpdateDischargeUseCase;
use App\Domain\Discharge\Repositories\DischargeRepositoryInterface;
use App\Infrastructure\Persistence\Repositories\EloquentDischargeRepository;
use Illuminate\Support\ServiceProvider;

class DischargeServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(DischargeRepositoryInterface::class, EloquentDischargeRepository::class);

        $this->app->bind(CreateDischargeUseCase::class, fn ($app) => new CreateDischargeUseCase($app->make(DischargeRepositoryInterface::class)));
        $this->app->bind(UpdateDischargeUseCase::class, fn ($app) => new UpdateDischargeUseCase($app->make(DischargeRepositoryInterface::class)));
        $this->app->bind(GetDischargeUseCase::class, fn ($app) => new GetDischargeUseCase($app->make(DischargeRepositoryInterface::class)));
        $this->app->bind(GetDischargesUseCase::class, fn ($app) => new GetDischargesUseCase($app->make(DischargeRepositoryInterface::class)));
        $this->app->bind(GetDischargesByPortCallUseCase::class, fn ($app) => new GetDischargesByPortCallUseCase($app->make(DischargeRepositoryInterface::class)));
        $this->app->bind(DeleteDischargeUseCase::class, fn ($app) => new DeleteDischargeUseCase($app->make(DischargeRepositoryInterface::class)));
    }

    public function boot(): void {}
}
