<?php

namespace App\Providers;

use App\Application\Inspection\UseCases\AddCheckpointPhotoUseCase;
use App\Application\Inspection\UseCases\ConfirmInspectionUseCase;
use App\Application\Inspection\UseCases\RemoveCheckpointPhotoUseCase;
use App\Application\Inspection\UseCases\UpdateCheckpointCommentUseCase;
use App\Application\Inspection\UseCases\UpdateCheckpointStatusUseCase;
use App\Domain\Inspection\Repositories\InspectionRepositoryInterface;
use App\Domain\Storage\Repositories\FileStorageRepositoryInterface;
use App\Infrastructure\Persistence\Repositories\InspectionRepository;
use App\Infrastructure\Services\CloudflareR2FileStorageService;
use Illuminate\Support\ServiceProvider;

class InspectionCheckpointServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(InspectionRepositoryInterface::class, InspectionRepository::class);
        $this->app->bind(FileStorageRepositoryInterface::class, CloudflareR2FileStorageService::class);

        $this->app->bind(UpdateCheckpointStatusUseCase::class, function ($app) {
            return new UpdateCheckpointStatusUseCase(
                $app->make(InspectionRepositoryInterface::class)
            );
        });

        $this->app->bind(UpdateCheckpointCommentUseCase::class, function ($app) {
            return new UpdateCheckpointCommentUseCase(
                $app->make(InspectionRepositoryInterface::class)
            );
        });

        $this->app->bind(AddCheckpointPhotoUseCase::class, function ($app) {
            return new AddCheckpointPhotoUseCase(
                $app->make(InspectionRepositoryInterface::class),
                $app->make(FileStorageRepositoryInterface::class)
            );
        });

        $this->app->bind(RemoveCheckpointPhotoUseCase::class, function ($app) {
            return new RemoveCheckpointPhotoUseCase(
                $app->make(InspectionRepositoryInterface::class),
                $app->make(FileStorageRepositoryInterface::class)
            );
        });

        $this->app->bind(ConfirmInspectionUseCase::class, function ($app) {
            return new ConfirmInspectionUseCase(
                $app->make(InspectionRepositoryInterface::class)
            );
        });
    }

    public function boot(): void
    {
        //
    }
}
