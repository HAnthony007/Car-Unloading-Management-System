<?php

return [
    App\Providers\AppServiceProvider::class,
    App\Providers\ParkingServiceProvider::class,
    App\Providers\DockServiceProvider::class,
    App\Providers\VesselServiceProvider::class,
    App\Providers\PortCallServiceProvider::class,
    App\Providers\DischargeServiceProvider::class,
    App\Providers\VehicleServiceProvider::class,
    App\Providers\FollowUpFileServiceProvider::class,
    App\Providers\SurveyServiceProvider::class,
    App\Providers\SurveyCheckpointServiceProvider::class,
    App\Providers\MovementServiceProvider::class,
    App\Infrastructure\Providers\StorageServiceProvider::class,
];
