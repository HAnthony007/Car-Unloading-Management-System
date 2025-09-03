<?php

namespace App\Presentation\Http\Controllers;

use App\Application\Manifest\Exceptions\ManifestImportException;
use App\Application\Manifest\UseCases\ImportManifestUseCase;
use App\Presentation\Http\Requests\ImportManifestRequest;
use Illuminate\Http\JsonResponse;

final class ManifestImportController extends Controller
{
    public function __construct(private readonly ImportManifestUseCase $useCase) {}

    public function import(ImportManifestRequest $request): JsonResponse
    {
        try {
            $file = $request->file('file');
            $result = $this->useCase->execute($file);

            return response()->json([
                'message' => 'Importation du manifeste terminée.',
                'data' => $result,
            ], 200);
        } catch (ManifestImportException $e) {
            // Clear, structured error with rollback guarantee and detailed errors
            return response()->json([
                'message' => $e->getMessage(),
                'rolled_back' => true,
                'stats' => $e->stats ?? [],
                'errors' => $e->errors ?? [],
            ], 422);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => "Echec de l'importation du manifeste.",
                'error' => $e->getMessage(),
            ], 400);
        }
    }
}
