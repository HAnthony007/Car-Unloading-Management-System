<?php

namespace App\Console\Commands;

use App\Application\Manifest\UseCases\ImportManifestUseCase;
use Illuminate\Console\Command;

class ImportManifestCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'manifest:import {file : Chemin vers le fichier Excel (.xlsx/.xls)}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Importer un manifeste (Navire + Véhicules) depuis un fichier Excel';

    public function __construct(private readonly ImportManifestUseCase $useCase)
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $filePath = $this->argument('file');

        if (! file_exists($filePath)) {
            $this->error("Le fichier {$filePath} n'existe pas.");

            return self::FAILURE;
        }

        $ext = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));
        if (! in_array($ext, ['xlsx', 'xls'])) {
            $this->error('Le fichier doit être de type Excel (.xlsx, .xls).');

            return self::FAILURE;
        }

        $this->info("Import du manifeste: {$filePath}");

        try {
            // Adapter vers Illuminate UploadedFile pour respecter la signature du UseCase
            $uploaded = new \Illuminate\Http\UploadedFile(
                $filePath,
                basename($filePath),
                null,
                UPLOAD_ERR_OK,
                true // test mode
            );
            $result = $this->useCase->execute($uploaded);

            $this->info('Import terminé.');
            $this->line('- Vessels créés: '.$result['vessels_created']);
            $this->line('- Port calls créés: '.$result['port_calls_created']);
            $this->line('- Véhicules créés: '.$result['vehicles_created']);
            $this->line('- Dossiers de suivi créés: '.$result['follow_up_files_created']);
            $this->line('- Véhicules ignorés: '.$result['vehicles_skipped']);

            if (! empty($result['errors'])) {
                $this->warn("\nErreurs:");
                foreach ($result['errors'] as $err) {
                    $this->line('  - '.$err);
                }
            }

            return self::SUCCESS;
        } catch (\Throwable $e) {
            $this->error('Erreur: '.$e->getMessage());

            return self::FAILURE;
        }
    }
}
