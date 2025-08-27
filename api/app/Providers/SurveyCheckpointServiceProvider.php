<?php

namespace App\Providers;

use App\Application\SurveyCheckpoint\UseCases\CreateSurveyCheckpointUseCase;
use App\Application\SurveyCheckpoint\UseCases\DeleteSurveyCheckpointUseCase;
use App\Application\SurveyCheckpoint\UseCases\GetSurveyCheckpointUseCase;
use App\Application\SurveyCheckpoint\UseCases\ListSurveyCheckpointsUseCase;
use App\Application\SurveyCheckpoint\UseCases\SearchSurveyCheckpointsUseCase;
use App\Application\SurveyCheckpoint\UseCases\UpdateSurveyCheckpointUseCase;
use App\Domain\SurveyCheckpoint\Repositories\SurveyCheckpointRepositoryInterface;
use App\Infrastructure\Persistence\Repositories\EloquentSurveyCheckpointRepository;
use Illuminate\Support\ServiceProvider;

class SurveyCheckpointServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(SurveyCheckpointRepositoryInterface::class, EloquentSurveyCheckpointRepository::class);

        $this->app->bind(CreateSurveyCheckpointUseCase::class, fn ($app) => new CreateSurveyCheckpointUseCase($app->make(SurveyCheckpointRepositoryInterface::class)));
        $this->app->bind(UpdateSurveyCheckpointUseCase::class, fn ($app) => new UpdateSurveyCheckpointUseCase($app->make(SurveyCheckpointRepositoryInterface::class)));
        $this->app->bind(GetSurveyCheckpointUseCase::class, fn ($app) => new GetSurveyCheckpointUseCase($app->make(SurveyCheckpointRepositoryInterface::class)));
        $this->app->bind(DeleteSurveyCheckpointUseCase::class, fn ($app) => new DeleteSurveyCheckpointUseCase($app->make(SurveyCheckpointRepositoryInterface::class)));
        $this->app->bind(ListSurveyCheckpointsUseCase::class, fn ($app) => new ListSurveyCheckpointsUseCase($app->make(SurveyCheckpointRepositoryInterface::class)));
        $this->app->bind(SearchSurveyCheckpointsUseCase::class, fn ($app) => new SearchSurveyCheckpointsUseCase($app->make(SurveyCheckpointRepositoryInterface::class)));
    }

    public function boot(): void {}
}
