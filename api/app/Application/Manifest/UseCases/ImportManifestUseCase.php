<?php

namespace App\Application\Manifest\UseCases;

use App\Application\Manifest\Exceptions\ManifestImportException;
use App\Imports\Manifest\ManifestContext;
use App\Imports\Manifest\ManifestImport;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
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
            // Ensure the whole manifest import is atomic: rollback everything on any error
            $result = DB::transaction(function () use ($import, $file, $ctx) {
                Excel::import($import, $file);

                // If any errors were collected during sheet processing, cancel the import
                if (! empty($ctx->errors)) {
                    $ex = new ManifestImportException('Import interrompu: des erreurs ont été détectées, toutes les modifications ont été annulées.');
                    $ex->errors = $ctx->errors;
                    $ex->stats = [
                        'vessels_created' => $ctx->importedVessels,
                        'port_calls_created' => $ctx->importedPortCalls,
                        'vehicles_created' => $ctx->importedVehicles,
                        'follow_up_files_created' => $ctx->createdFollowUpFiles,
                        'vehicles_skipped' => $ctx->skippedVehicles,
                    ];
                    $ex->rolledBack = true;
                    throw $ex;
                }

                return [
                    'vessels_created' => $ctx->importedVessels,
                    'port_calls_created' => $ctx->importedPortCalls,
                    'vehicles_created' => $ctx->importedVehicles,
                    'follow_up_files_created' => $ctx->createdFollowUpFiles,
                    'vehicles_skipped' => $ctx->skippedVehicles,
                    'errors' => $ctx->errors,
                ];
            });

            return $result;

        } catch (\Throwable $e) {
            // Bubble up detailed error when available
            if ($e instanceof ManifestImportException) {
                throw $e;
            }
            throw new \RuntimeException("Erreur lors de l'importation du manifeste: ".$e->getMessage(), 0, $e);
        }
    }
}
