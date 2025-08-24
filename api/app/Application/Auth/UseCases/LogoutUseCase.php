<?php

namespace App\Application\Auth\UseCases;

use Illuminate\Support\Facades\Auth;

final class LogoutUseCase
{
    public function execute(): void
    {
        Auth::user()->currentAccessToken()->delete();
    }
}
