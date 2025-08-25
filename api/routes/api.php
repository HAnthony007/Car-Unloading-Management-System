<?php

use App\Presentation\Http\Controllers\AuthController;
use App\Presentation\Http\Controllers\UserController;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request): User {
    return $request->user();
})->middleware('auth:sanctum');

Route::prefix('auth')
    ->group(function (): void {
        Route::post('/register', [AuthController::class, 'register'])->name('register');
        Route::post('/login', [AuthController::class, 'login'])->name('login');

        Route::middleware('auth:sanctum')->group(function () {
            Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
        });
    });

// User Management Routes
Route::prefix('users')
    ->middleware('auth:sanctum')
    ->group(function (): void {
        // Search and list users
        Route::get('/', [UserController::class, 'index'])->name('users.index');
        
        // Create new user
        Route::post('/', [UserController::class, 'store'])->name('users.store');
        
        // Import users from Excel file
        Route::post('/import', [UserController::class, 'import'])->name('users.import');
        
        // Get user by ID
        Route::get('/{userId}', [UserController::class, 'show'])->name('users.show');
        
        // Get user by matriculation number
        Route::get('/matriculation/{matriculationNumber}', [UserController::class, 'showByMatriculationNumber'])
            ->name('users.show.by.matriculation');
        
        // Update user profile
        Route::put('/{userId}', [UserController::class, 'update'])->name('users.update');
        
        // Delete user
        Route::delete('/{userId}', [UserController::class, 'destroy'])->name('users.destroy');
    });

// Role Management Routes
Route::prefix('roles')
    ->middleware('auth:sanctum')
    ->group(function (): void {
        Route::get('/', [\App\Presentation\Http\Controllers\RoleController::class, 'index'])->name('roles.index');
        Route::post('/', [\App\Presentation\Http\Controllers\RoleController::class, 'store'])->name('roles.store');
        Route::get('/{id}', [\App\Presentation\Http\Controllers\RoleController::class, 'show'])->name('roles.show');
        Route::put('/{id}', [\App\Presentation\Http\Controllers\RoleController::class, 'update'])->name('roles.update');
        Route::delete('/{id}', [\App\Presentation\Http\Controllers\RoleController::class, 'destroy'])->name('roles.destroy');
    });
