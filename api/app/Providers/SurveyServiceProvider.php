<?php

namespace App\Providers;

use App\Application\Survey\UseCases\CreateSurveyUseCase;
use App\Application\Survey\UseCases\DeleteSurveyUseCase;
use App\Application\Survey\UseCases\GetSurveyUseCase;
use App\Application\Survey\UseCases\SearchSurveysUseCase;
use App\Application\Survey\UseCases\UpdateSurveyUseCase;
use App\Domain\Survey\Repositories\SurveyRepositoryInterface;
use App\Infrastructure\Persistence\Repositories\EloquentSurveyRepository;
use Illuminate\Support\ServiceProvider;

class SurveyServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(SurveyRepositoryInterface::class, EloquentSurveyRepository::class);

        $this->app->bind(CreateSurveyUseCase::class, fn ($app) => new CreateSurveyUseCase($app->make(SurveyRepositoryInterface::class)));
        $this->app->bind(UpdateSurveyUseCase::class, fn ($app) => new UpdateSurveyUseCase($app->make(SurveyRepositoryInterface::class)));
        $this->app->bind(GetSurveyUseCase::class, fn ($app) => new GetSurveyUseCase($app->make(SurveyRepositoryInterface::class)));
        $this->app->bind(DeleteSurveyUseCase::class, fn ($app) => new DeleteSurveyUseCase($app->make(SurveyRepositoryInterface::class)));
        $this->app->bind(SearchSurveysUseCase::class, fn ($app) => new SearchSurveysUseCase($app->make(SurveyRepositoryInterface::class)));
    }

    public function boot(): void {}
}
