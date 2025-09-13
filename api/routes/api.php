<?php

use App\Models\User;
use App\Presentation\Http\Controllers\AuthController;
use App\Presentation\Http\Controllers\UserAvatarController;
use App\Presentation\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request): User {
    return $request->user();
})->middleware('auth:sanctum');

Route::prefix('auth')
    ->group(function (): void {
        Route::post('/register', [AuthController::class, 'register'])->name('register');
        Route::post('/login', [AuthController::class, 'login'])->name('login');
    Route::get('/{id}/inspection', [\App\Presentation\Http\Controllers\InspectionController::class, 'showByDischarge'])->name('discharges.inspection.show');
        // SPA cookie-based session authentication endpoints
        Route::post('/spa/login', [AuthController::class, 'spaLogin'])->name('spa.login');

        Route::middleware('auth:sanctum')->group(function () {
            Route::get('/me', [AuthController::class, 'me'])->name('me');
            Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
            Route::post('/spa/logout', [AuthController::class, 'spaLogout'])->name('spa.logout');
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

        // User Avatar management
        Route::post('/{userId}/avatar', [UserAvatarController::class, 'upload'])->name('users.avatar.upload');
        Route::delete('/{userId}/avatar', [UserAvatarController::class, 'delete'])->name('users.avatar.delete');
        Route::get('/{userId}/avatar', [UserAvatarController::class, 'getUrl'])->name('users.avatar.url');
    });

// Manifest import route
Route::prefix('imports')
    ->middleware('auth:sanctum')
    ->group(function (): void {
        Route::post('/manifest', [\App\Presentation\Http\Controllers\ManifestImportController::class, 'import'])->name('imports.manifest');
    });

// Surveys Management Routes
Route::prefix('surveys')
    ->middleware('auth:sanctum')
    ->group(function (): void {
        Route::get('/', [\App\Presentation\Http\Controllers\SurveyController::class, 'index'])->name('surveys.index');
        Route::post('/', [\App\Presentation\Http\Controllers\SurveyController::class, 'store'])->name('surveys.store');
        Route::get('/{id}', [\App\Presentation\Http\Controllers\SurveyController::class, 'show'])->name('surveys.show');
        Route::put('/{id}', [\App\Presentation\Http\Controllers\SurveyController::class, 'update'])->name('surveys.update');
        Route::delete('/{id}', [\App\Presentation\Http\Controllers\SurveyController::class, 'destroy'])->name('surveys.destroy');
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

// Vehicle Management Routes
Route::prefix('vehicles')
    ->middleware('auth:sanctum')
    ->group(function (): void {
        Route::get('/', [\App\Presentation\Http\Controllers\VehicleController::class, 'index'])->name('vehicles.index');
        Route::post('/', [\App\Presentation\Http\Controllers\VehicleController::class, 'store'])->name('vehicles.store');
        Route::get('/{id}', [\App\Presentation\Http\Controllers\VehicleController::class, 'show'])->name('vehicles.show');
        Route::put('/{id}', [\App\Presentation\Http\Controllers\VehicleController::class, 'update'])->name('vehicles.update');
        Route::delete('/{id}', [\App\Presentation\Http\Controllers\VehicleController::class, 'destroy'])->name('vehicles.destroy');

        // (Legacy) route removed: movements are now associated to discharges, not vehicles.
    });

// Discharge Movements Nested Route
Route::prefix('discharges')
    ->middleware('auth:sanctum')
    ->group(function (): void {
        Route::get('/{id}/movements', [\App\Presentation\Http\Controllers\MovementController::class, 'byDischarge'])->name('discharges.movements');
    });

// Parking Management Routes
Route::prefix('parkings')
    ->middleware('auth:sanctum')
    ->group(function (): void {
        Route::get('/', [\App\Presentation\Http\Controllers\ParkingController::class, 'index'])->name('parkings.index');
        Route::post('/', [\App\Presentation\Http\Controllers\ParkingController::class, 'store'])->name('parkings.store');
        Route::get('/{id}', [\App\Presentation\Http\Controllers\ParkingController::class, 'show'])->name('parkings.show');
        // Discharges currently in this parking
        Route::get('/{id}/discharges', [\App\Presentation\Http\Controllers\ParkingController::class, 'discharges'])->name('parkings.discharges');
        Route::put('/{id}', [\App\Presentation\Http\Controllers\ParkingController::class, 'update'])->name('parkings.update');
        Route::delete('/{id}', [\App\Presentation\Http\Controllers\ParkingController::class, 'destroy'])->name('parkings.destroy');
    });

// Dock Management Routes
Route::prefix('docks')
    ->middleware('auth:sanctum')
    ->group(function (): void {
        Route::get('/', [\App\Presentation\Http\Controllers\DockController::class, 'index'])->name('docks.index');
        Route::post('/', [\App\Presentation\Http\Controllers\DockController::class, 'store'])->name('docks.store');
        Route::get('/{id}', [\App\Presentation\Http\Controllers\DockController::class, 'show'])->name('docks.show');
        Route::put('/{id}', [\App\Presentation\Http\Controllers\DockController::class, 'update'])->name('docks.update');
        Route::delete('/{id}', [\App\Presentation\Http\Controllers\DockController::class, 'destroy'])->name('docks.destroy');
    });

// Vessel Management Routes
Route::prefix('vessels')
    ->middleware('auth:sanctum')
    ->group(function (): void {
        Route::get('/', [\App\Presentation\Http\Controllers\VesselController::class, 'index'])->name('vessels.index');
        Route::post('/', [\App\Presentation\Http\Controllers\VesselController::class, 'store'])->name('vessels.store');
        Route::get('/{id}', [\App\Presentation\Http\Controllers\VesselController::class, 'show'])->name('vessels.show');
        Route::put('/{id}', [\App\Presentation\Http\Controllers\VesselController::class, 'update'])->name('vessels.update');
        Route::delete('/{id}', [\App\Presentation\Http\Controllers\VesselController::class, 'destroy'])->name('vessels.destroy');
    });

// Port Call Management Routes
Route::prefix('port-calls')
    ->middleware('auth:sanctum')
    ->group(function (): void {
        Route::get('/', [\App\Presentation\Http\Controllers\PortCallController::class, 'index'])->name('portcalls.index');
        Route::post('/', [\App\Presentation\Http\Controllers\PortCallController::class, 'store'])->name('portcalls.store');
        Route::get('/{id}', [\App\Presentation\Http\Controllers\PortCallController::class, 'show'])->name('portcalls.show');
        // Vehicles for a port call (canonical)
        Route::get('/{id}/vehicles', [\App\Presentation\Http\Controllers\PortCallController::class, 'vehicles'])->name('portcalls.vehicles');
        // Backward compatibility (French path)
        Route::get('/{id}/vehicules', [\App\Presentation\Http\Controllers\PortCallController::class, 'vehicles'])->name('portcalls.vehicules');
        // Check vehicle membership (VIN + port call)
        Route::get('/{id}/vehicles/check', [\App\Presentation\Http\Controllers\PortCallController::class, 'checkVehicleByVin'])->name('portcalls.vehicles.check');
        Route::put('/{id}', [\App\Presentation\Http\Controllers\PortCallController::class, 'update'])->name('portcalls.update');
        Route::delete('/{id}', [\App\Presentation\Http\Controllers\PortCallController::class, 'destroy'])->name('portcalls.destroy');

        // Nested: list discharges for a specific port call
        Route::get('/{id}/discharges', [\App\Presentation\Http\Controllers\DischargeController::class, 'byPortCall'])->name('portcalls.discharges');
    });

// Discharge Management Routes
Route::prefix('discharges')
    ->middleware('auth:sanctum')
    ->group(function (): void {
        Route::get('/', [\App\Presentation\Http\Controllers\DischargeController::class, 'index'])->name('discharges.index');
        Route::post('/', [\App\Presentation\Http\Controllers\DischargeController::class, 'store'])->name('discharges.store');
        Route::get('/{id}', [\App\Presentation\Http\Controllers\DischargeController::class, 'show'])->name('discharges.show');
    // Inspection (surveys + checkpoints) for a specific discharge
    Route::get('/{id}/inspection', [\App\Presentation\Http\Controllers\InspectionController::class, 'showByDischarge'])->name('discharges.inspection.show');
        Route::put('/{id}', [\App\Presentation\Http\Controllers\DischargeController::class, 'update'])->name('discharges.update');
        Route::delete('/{id}', [\App\Presentation\Http\Controllers\DischargeController::class, 'destroy'])->name('discharges.destroy');
    });

// Follow Up Files Management Routes
Route::prefix('follow-up-files')
    ->middleware('auth:sanctum')
    ->group(function (): void {
        Route::get('/', [\App\Presentation\Http\Controllers\FollowUpFileController::class, 'index'])->name('followupfiles.index');
        Route::post('/', [\App\Presentation\Http\Controllers\FollowUpFileController::class, 'store'])->name('followupfiles.store');
        Route::get('/{id}', [\App\Presentation\Http\Controllers\FollowUpFileController::class, 'show'])->name('followupfiles.show');
        Route::put('/{id}', [\App\Presentation\Http\Controllers\FollowUpFileController::class, 'update'])->name('followupfiles.update');
        Route::delete('/{id}', [\App\Presentation\Http\Controllers\FollowUpFileController::class, 'destroy'])->name('followupfiles.destroy');

        // Nested: upload a photo for a specific follow-up file
        Route::post('/{id}/photos', [\App\Presentation\Http\Controllers\FollowUpFilePhotoController::class, 'store'])->name('followupfiles.photos.store');
    });

// Survey Checkpoints Management Routes
Route::prefix('survey-checkpoints')
    ->middleware('auth:sanctum')
    ->group(function (): void {
        Route::get('/', [\App\Presentation\Http\Controllers\SurveyCheckpointController::class, 'index'])->name('surveycheckpoints.index');
        Route::post('/', [\App\Presentation\Http\Controllers\SurveyCheckpointController::class, 'store'])->name('surveycheckpoints.store');
        Route::get('/{id}', [\App\Presentation\Http\Controllers\SurveyCheckpointController::class, 'show'])->name('surveycheckpoints.show');
        Route::put('/{id}', [\App\Presentation\Http\Controllers\SurveyCheckpointController::class, 'update'])->name('surveycheckpoints.update');
        Route::delete('/{id}', [\App\Presentation\Http\Controllers\SurveyCheckpointController::class, 'destroy'])->name('surveycheckpoints.destroy');
    });

// Inspection Initialization Route
Route::prefix('inspections')
    ->middleware('auth:sanctum')
    ->group(function (): void {
        Route::post('/start', [\App\Presentation\Http\Controllers\InspectionController::class, 'start'])->name('inspections.start');
    });

// Survey Templates Admin Routes
Route::prefix('inspection/templates')
    ->middleware('auth:sanctum')
    ->group(function (): void {
        Route::get('/', [\App\Presentation\Http\Controllers\SurveyTemplateController::class, 'index'])->name('surveytemplates.index');
        Route::post('/', [\App\Presentation\Http\Controllers\SurveyTemplateController::class, 'store'])->name('surveytemplates.store');
        Route::get('/{id}', [\App\Presentation\Http\Controllers\SurveyTemplateController::class, 'show'])->name('surveytemplates.show');
        Route::put('/{id}', [\App\Presentation\Http\Controllers\SurveyTemplateController::class, 'update'])->name('surveytemplates.update');
        Route::delete('/{id}', [\App\Presentation\Http\Controllers\SurveyTemplateController::class, 'destroy'])->name('surveytemplates.destroy');
        // Checkpoints nested
        Route::post('/{id}/checkpoints', [\App\Presentation\Http\Controllers\SurveyTemplateController::class, 'storeCheckpoint'])->name('surveytemplates.checkpoints.store');
        Route::put('/checkpoints/{checkpointId}', [\App\Presentation\Http\Controllers\SurveyTemplateController::class, 'updateCheckpoint'])->name('surveytemplates.checkpoints.update');
        Route::delete('/checkpoints/{checkpointId}', [\App\Presentation\Http\Controllers\SurveyTemplateController::class, 'destroyCheckpoint'])->name('surveytemplates.checkpoints.destroy');
    });

// Photos Management Routes
Route::prefix('photos')
    ->middleware('auth:sanctum')
    ->group(function (): void {
        Route::get('/', [\App\Presentation\Http\Controllers\PhotoController::class, 'index'])->name('photos.index');
        Route::post('/', [\App\Presentation\Http\Controllers\PhotoController::class, 'store'])->name('photos.store');
        Route::get('/{id}', [\App\Presentation\Http\Controllers\PhotoController::class, 'show'])->name('photos.show');
        Route::put('/{id}', [\App\Presentation\Http\Controllers\PhotoController::class, 'update'])->name('photos.update');
        Route::delete('/{id}', [\App\Presentation\Http\Controllers\PhotoController::class, 'destroy'])->name('photos.destroy');
        // File operations (Cloudflare R2)
        Route::post('/{id}/upload', [\App\Presentation\Http\Controllers\PhotoController::class, 'upload'])->name('photos.upload');
        Route::get('/{id}/url', [\App\Presentation\Http\Controllers\PhotoController::class, 'getUrl'])->name('photos.url');
    });

// Documents Management Routes
Route::prefix('documents')
    ->middleware('auth:sanctum')
    ->group(function (): void {
        Route::get('/', [\App\Presentation\Http\Controllers\DocumentController::class, 'index'])->name('documents.index');
        Route::post('/', [\App\Presentation\Http\Controllers\DocumentController::class, 'store'])->name('documents.store');
        Route::get('/{id}', [\App\Presentation\Http\Controllers\DocumentController::class, 'show'])->name('documents.show');
        Route::put('/{id}', [\App\Presentation\Http\Controllers\DocumentController::class, 'update'])->name('documents.update');
        Route::delete('/{id}', [\App\Presentation\Http\Controllers\DocumentController::class, 'destroy'])->name('documents.destroy');
    });

// Movements Management Routes
Route::prefix('movements')
    ->middleware('auth:sanctum')
    ->group(function (): void {
        Route::get('/', [\App\Presentation\Http\Controllers\MovementController::class, 'index'])->name('movements.index');
        Route::post('/', [\App\Presentation\Http\Controllers\MovementController::class, 'store'])->name('movements.store');
        Route::get('/{id}', [\App\Presentation\Http\Controllers\MovementController::class, 'show'])->name('movements.show');
        Route::put('/{id}', [\App\Presentation\Http\Controllers\MovementController::class, 'update'])->name('movements.update');
        Route::delete('/{id}', [\App\Presentation\Http\Controllers\MovementController::class, 'destroy'])->name('movements.destroy');
    });
