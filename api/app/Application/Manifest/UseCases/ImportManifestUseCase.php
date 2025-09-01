<?php

namespace App\Application\Manifest\UseCases;

use App\Imports\Manifest\ManifestContext;
use App\Imports\Manifest\ManifestImport;
use Illuminate\Http\UploadedFile;
use Maatwebsite\Excel\Facades\Excel;

final class ImportManifestUseCase
{
    public function execute(UploadedFile $file): array
    {
        if (! in_array(strtolower($file->getClientOriginalExtension()), ['xlsx', 'xls'])) {
            throw new \RuntimeException('Le fichier doit être de type Excel (.xlsx, .xls)');
        }

        $ctx = new ManifestContext;
        $import = new ManifestImport($ctx);

        try {
            Excel::import($import, $file);

            return [
                'vessels_created' => $ctx->importedVessels,
                'port_calls_created' => $ctx->importedPortCalls,
                'vehicles_created' => $ctx->importedVehicles,
                'follow_up_files_created' => $ctx->createdFollowUpFiles,
                'vehicles_skipped' => $ctx->skippedVehicles,
                'errors' => $ctx->errors,
            ];

        } catch (\Throwable $e) {
            throw new \RuntimeException("Erreur lors de l'importation du manifeste: ".$e->getMessage());
        }
    }
}
