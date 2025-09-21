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
        // 1) Validation basique: uniquement des fichiers Excel sont acceptés
        if (! in_array(strtolower($file->getClientOriginalExtension()), ['xlsx', 'xls'])) {
            throw new \RuntimeException('Le fichier doit être de type Excel (.xlsx, .xls)');
        }

        // Contexte partagé entre les différentes étapes/feuilles de l'import
        $ctx = new ManifestContext;
        // Adaptateur d'import qui s'appuie sur le contexte ci-dessus
        $import = new ManifestImport($ctx);

        try {
            // 2) Transaction: garantit un import atomique (rollback si n'importe quelle étape échoue)
            $result = DB::transaction(function () use ($import, $file, $ctx) {
                // Déclenche l'import du fichier (découpage en feuilles/ lignes géré par $import)
                Excel::import($import, $file);

                // 3) Si le contexte a collecté des erreurs, on interrompt et on annule tout
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

                // 4) Succès: on retourne les statistiques d'import et la liste d'erreurs (vide)
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
            // Remonte l'exception métier détaillée si disponible (contient stats/erreurs)
            if ($e instanceof ManifestImportException) {
                throw $e;
            }
            // Sinon, encapsule dans une RuntimeException avec le message d'origine
            throw new \RuntimeException("Erreur lors de l'importation du manifeste: ".$e->getMessage(), 0, $e);
        }
    }
}

    /**
     * Cas d'utilisation: importer un manifeste Excel de façon atomique (tout ou rien).
     *
     * Principe:
     * - Valide l'extension du fichier (.xlsx/.xls).
     * - Démarre une transaction BD pour garantir le rollback en cas d'erreur.
     * - Lance l'import via Maatwebsite\\Excel avec un contexte partagé (ManifestContext)
     *   qui collecte les erreurs et les statistiques au fil des feuilles/ lignes.
     * - Si des erreurs sont détectées par l'import, lève une ManifestImportException,
     *   provoquant l'annulation de toutes les écritures.
     *
     * La structure et la logique métier de lecture des feuilles sont déléguées à
     * ManifestImport et ManifestContext.
     */