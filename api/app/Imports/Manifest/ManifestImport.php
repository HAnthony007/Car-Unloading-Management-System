<?php

namespace App\Imports\Manifest;

use Maatwebsite\Excel\Concerns\WithMultipleSheets;

class ManifestImport implements WithMultipleSheets
{
    public function __construct(private readonly ManifestContext $ctx) {}

    public function sheets(): array
    {
        // Map by index only to be resilient to slight name differences
        // 0 => Navire, 1 => Véhicules; third sheet (Douanes) intentionally ignored
        return [
            0 => new NavireSheetImport($this->ctx),
            1 => new VehiculesSheetImport($this->ctx),
        ];
    }
}
