<?php

namespace App\Providers;

use App\Application\FollowUpFile\UseCases\CreateFollowUpFileUseCase;
use App\Application\FollowUpFile\UseCases\DeleteFollowUpFileUseCase;
use App\Application\FollowUpFile\UseCases\GetFollowUpFileUseCase;
use App\Application\FollowUpFile\UseCases\SearchFollowUpFilesUseCase;
use App\Application\FollowUpFile\UseCases\UpdateFollowUpFileUseCase;
use App\Domain\FollowUpFile\Repositories\FollowUpFileRepositoryInterface;
use App\Infrastructure\Persistence\Repositories\EloquentFollowUpFileRepository;
use Illuminate\Support\ServiceProvider;

class FollowUpFileServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(FollowUpFileRepositoryInterface::class, EloquentFollowUpFileRepository::class);

        $this->app->bind(CreateFollowUpFileUseCase::class, fn ($app) => new CreateFollowUpFileUseCase($app->make(FollowUpFileRepositoryInterface::class)));
        $this->app->bind(UpdateFollowUpFileUseCase::class, fn ($app) => new UpdateFollowUpFileUseCase($app->make(FollowUpFileRepositoryInterface::class)));
        $this->app->bind(GetFollowUpFileUseCase::class, fn ($app) => new GetFollowUpFileUseCase($app->make(FollowUpFileRepositoryInterface::class)));
        $this->app->bind(DeleteFollowUpFileUseCase::class, fn ($app) => new DeleteFollowUpFileUseCase($app->make(FollowUpFileRepositoryInterface::class)));
        $this->app->bind(SearchFollowUpFilesUseCase::class, fn ($app) => new SearchFollowUpFilesUseCase($app->make(FollowUpFileRepositoryInterface::class)));
    }

    public function boot(): void {}
}
