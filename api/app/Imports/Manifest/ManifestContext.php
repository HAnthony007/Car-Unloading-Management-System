<?php

namespace App\Imports\Manifest;

use App\Models\PortCall;
use App\Models\Vessel;

class ManifestContext
{
    public ?Vessel $vessel = null;

    public ?PortCall $portCall = null;

    public int $importedVessels = 0;

    public int $importedPortCalls = 0;

    public int $importedVehicles = 0;

    public int $createdFollowUpFiles = 0;

    public int $skippedVehicles = 0;

    /** @var array<int,string> */
    public array $errors = [];

    // One-time debug flags to avoid noise
    public bool $loggedVehicleHeaders = false;

    public bool $loggedNavireHeaders = false;
}
