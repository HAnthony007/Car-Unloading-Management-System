<?php

namespace App\Presentation\Http\Controllers;

use App\Application\Inspection\DTOs\AddCheckpointPhotoDTO;
use App\Application\Inspection\DTOs\ConfirmInspectionDTO;
use App\Application\Inspection\DTOs\RemoveCheckpointPhotoDTO;
use App\Application\Inspection\DTOs\UpdateCheckpointCommentDTO;
use App\Application\Inspection\DTOs\UpdateCheckpointStatusDTO;
use App\Application\Inspection\UseCases\AddCheckpointPhotoUseCase;
use App\Application\Inspection\UseCases\ConfirmInspectionUseCase;
use App\Application\Inspection\UseCases\RemoveCheckpointPhotoUseCase;
use App\Application\Inspection\UseCases\UpdateCheckpointCommentUseCase;
use App\Application\Inspection\UseCases\UpdateCheckpointStatusUseCase;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class InspectionCheckpointController extends Controller
{
    public function __construct(
        private UpdateCheckpointStatusUseCase $updateStatusUseCase,
        private UpdateCheckpointCommentUseCase $updateCommentUseCase,
        private AddCheckpointPhotoUseCase $addPhotoUseCase,
        private RemoveCheckpointPhotoUseCase $removePhotoUseCase,
        private ConfirmInspectionUseCase $confirmInspectionUseCase
    ) {}

    /**
     * Update checkpoint status
     */
    public function updateStatus(Request $request, string $id): JsonResponse
    {
        try {
            $validated = $request->validate([
                'status' => 'required|string|in:ok,defaut,na',
            ]);

            $dto = new UpdateCheckpointStatusDTO(
                checkpointId: (int) $id,
                status: $validated['status']
            );

            $result = $this->updateStatusUseCase->execute($dto);

            return response()->json([
                'success' => true,
                'message' => 'Statut du checkpoint mis à jour avec succès',
                'data' => $result,
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Données de validation invalides',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour du statut',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update checkpoint comment
     */
    public function updateComment(Request $request, string $id): JsonResponse
    {
        try {
            $validated = $request->validate([
                'comment' => 'required|string|max:1000',
            ]);

            $dto = new UpdateCheckpointCommentDTO(
                checkpointId: (int) $id,
                comment: $validated['comment']
            );

            $result = $this->updateCommentUseCase->execute($dto);

            return response()->json([
                'success' => true,
                'message' => 'Commentaire du checkpoint mis à jour avec succès',
                'data' => $result,
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Données de validation invalides',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour du commentaire',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Add photo to checkpoint
     */
    public function addPhoto(Request $request, string $id): JsonResponse
    {
        try {
            $validated = $request->validate([
                'photo' => 'required|image|mimes:jpeg,png,jpg,gif|max:10240', // 10MB max
            ]);

            $dto = new AddCheckpointPhotoDTO(
                checkpointId: (int) $id,
                photoFile: $request->file('photo')
            );

            $result = $this->addPhotoUseCase->execute($dto);

            return response()->json([
                'success' => true,
                'message' => 'Photo ajoutée avec succès',
                'data' => $result,
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Données de validation invalides',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'ajout de la photo',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove photo from checkpoint
     */
    public function removePhoto(Request $request, string $id, int $photoIndex): JsonResponse
    {
        try {
            $dto = new RemoveCheckpointPhotoDTO(
                checkpointId: (int) $id,
                photoIndex: $photoIndex
            );

            $result = $this->removePhotoUseCase->execute($dto);

            return response()->json([
                'success' => true,
                'message' => 'Photo supprimée avec succès',
                'data' => $result,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression de la photo',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Confirm inspection
     */
    public function confirmInspection(Request $request, string $id): JsonResponse
    {
        try {
            $dto = new ConfirmInspectionDTO(
                inspectionId: (int) $id
            );

            $result = $this->confirmInspectionUseCase->execute($dto);

            return response()->json([
                'success' => true,
                'message' => 'Inspection confirmée avec succès',
                'data' => $result,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la confirmation de l\'inspection',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
