<?php

namespace App\Application\User\UseCases;

use App\Imports\UsersImport;
use Illuminate\Http\UploadedFile;
use Maatwebsite\Excel\Facades\Excel;

final class ImportUsersUseCase
{
    public function execute(UploadedFile $file): array
    {
        // Valider le type de fichier
        if (!in_array($file->getClientOriginalExtension(), ['xlsx', 'xls', 'csv'])) {
            throw new \RuntimeException('Le fichier doit être de type Excel (.xlsx, .xls) ou CSV (.csv)');
        }

        // Créer une instance de l'import
        $import = new UsersImport();

        try {
            // Effectuer l'importation
            Excel::import($import, $file);

            // Retourner les résultats
            return [
                'imported_count' => $import->getImportedCount(),
                'skipped_count' => $import->getSkippedCount(),
                'errors' => $import->getErrors(),
                'total_processed' => $import->getImportedCount() + $import->getSkippedCount(),
            ];

        } catch (\Exception $e) {
            throw new \RuntimeException('Erreur lors de l\'importation: ' . $e->getMessage());
        }
    }
}
