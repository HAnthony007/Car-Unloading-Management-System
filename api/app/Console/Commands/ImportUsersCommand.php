<?php

namespace App\Console\Commands;

use App\Imports\UsersImport;
use Illuminate\Console\Command;
use Maatwebsite\Excel\Facades\Excel;

class ImportUsersCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'users:import {file : Le chemin vers le fichier Excel/CSV à importer}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Importer des utilisateurs depuis un fichier Excel ou CSV';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $filePath = $this->argument('file');

        // Vérifier que le fichier existe
        if (! file_exists($filePath)) {
            $this->error("Le fichier {$filePath} n'existe pas.");

            return Command::FAILURE;
        }

        // Vérifier l'extension du fichier
        $extension = pathinfo($filePath, PATHINFO_EXTENSION);
        if (! in_array(strtolower($extension), ['xlsx', 'xls', 'csv'])) {
            $this->error('Le fichier doit être de type Excel (.xlsx, .xls) ou CSV (.csv).');

            return Command::FAILURE;
        }

        $this->info("Début de l'importation des utilisateurs depuis : {$filePath}");

        try {
            $import = new UsersImport;

            Excel::import($import, $filePath);

            $this->info('Importation terminée avec succès !');
            $this->line("- Utilisateurs importés: {$import->getImportedCount()}");
            $this->line("- Utilisateurs ignorés: {$import->getSkippedCount()}");
            $this->line('- Total traité: '.($import->getImportedCount() + $import->getSkippedCount()));

            if (! empty($import->getErrors())) {
                $this->warn("\nErreurs rencontrées:");
                foreach ($import->getErrors() as $error) {
                    $this->line("  - {$error}");
                }
            }

            return Command::SUCCESS;

        } catch (\Exception $e) {
            $this->error("Erreur lors de l'importation: ".$e->getMessage());

            return Command::FAILURE;
        }
    }
}
