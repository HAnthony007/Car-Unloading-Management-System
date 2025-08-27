<?php

namespace App\Providers;

use App\Models\PersonalAccessToken;
use Illuminate\Support\ServiceProvider;
use Laravel\Sanctum\Sanctum;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Bind interfaces to implementations
        $this->app->bind(
            \App\Domain\User\Repositories\UserRepositoryInterface::class,
            \App\Infrastructure\Persistence\Repositories\EloquentUserRepository::class
        );

        $this->app->bind(
            \App\Domain\Role\Repositories\RoleRepositoryInterface::class,
            \App\Infrastructure\Persistence\Repositories\EloquentRoleRepository::class
        );

        $this->app->bind(
            \App\Domain\Parking\Repositories\ParkingRepositoryInterface::class,
            \App\Infrastructure\Persistence\Repositories\EloquentParkingRepository::class
        );
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
        Sanctum::usePersonalAccessTokenModel(PersonalAccessToken::class);
    }
}
