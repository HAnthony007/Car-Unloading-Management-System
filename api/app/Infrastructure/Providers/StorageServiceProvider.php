<?php

namespace App\Infrastructure\Providers;

use App\Domain\Storage\Repositories\StorageRepositoryInterface;
use App\Infrastructure\Persistence\Repositories\EloquentCloudflareR2StorageRepository;
use Illuminate\Support\ServiceProvider;

class StorageServiceProvider extends ServiceProvider
{
    public function register()
    {
        $this->app->bind(StorageRepositoryInterface::class, function ($app) {
            return new EloquentCloudflareR2StorageRepository('r2');
        });

        $this->app->bind('storage.local', function ($app) {
            return new EloquentCloudflareR2StorageRepository('local');
        });

        $this->app->bind('storage.public', function ($app) {
            return new EloquentCloudflareR2StorageRepository('public');
        });
    }

    public function boot(): void
    {
        //
    }
}
