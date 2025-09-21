<?php

namespace App\Presentation\Http\Controllers;

use App\Application\Photo\DTOs\UploadDischargePhotoDTO;
use App\Application\Photo\UseCases\UploadDischargePhotoUseCase;
use App\Application\Photo\DTOs\PhotoSearchCriteriaDTO;
use App\Application\Photo\UseCases\SearchPhotosUseCase;
use App\Application\Photo\UseCases\DeletePhotoUseCase;
use App\Models\Discharge;
use App\Presentation\Http\Requests\StoreDischargePhotoRequest;
use App\Presentation\Http\Requests\BatchStoreDischargePhotosRequest;
use Illuminate\Http\JsonResponse;

final class DischargePhotoController extends Controller
{
    public function __construct(
        private readonly UploadDischargePhotoUseCase $useCase,
        private readonly SearchPhotosUseCase $searchUseCase,
        private readonly DeletePhotoUseCase $deleteUseCase,
    ) {}

    /**
     * Create and upload a discharge photo to Cloudflare R2, returning path and URL.
     */
    public function store(StoreDischargePhotoRequest $request, int $dischargeId): JsonResponse
    {
        $discharge = Discharge::query()->find($dischargeId);
        if (! $discharge) {
            return response()->json(['error' => 'Discharge not found.'], 404);
        }

        $dto = UploadDischargePhotoDTO::fromArray([
            'discharge_id' => $discharge->discharge_id,
            'file' => $request->file('file'),
            'taken_at' => $request->date('taken_at')?->toDateTimeString() ?? now()->toISOString(),
            'photo_description' => $request->string('photo_description')->toString() ?: null,
            'checkpoint_id' => $request->has('checkpoint_id') ? (int) $request->integer('checkpoint_id') : null,
            'visibility' => $request->string('visibility')->toString() ?: 'public',
        ]);

        $domainPhoto = $this->useCase->execute($dto);

        return response()->json([
            'message' => 'Photo created and uploaded successfully.',
            'data' => [
                'photo_id' => $domainPhoto->getPhotoId()?->getValue(),
                'photo_path' => $domainPhoto->getPhotoPath(),
                'url' => app(\App\Domain\Storage\Repositories\StorageRepositoryInterface::class)->url($domainPhoto->getPhotoPath()),
                'discharge_id' => $domainPhoto->getDischargeId()->getValue(),
                'checkpoint_id' => $domainPhoto->getCheckpointId()?->getValue(),
            ],
        ], 201);
    }

    /**
     * Batch upload multiple photos for a discharge.
     */
    public function storeBatch(BatchStoreDischargePhotosRequest $request, int $dischargeId): JsonResponse
    {
        $discharge = Discharge::query()->find($dischargeId);
        if (! $discharge) {
            return response()->json(['error' => 'Discharge not found.'], 404);
        }

        $takenAt = $request->date('taken_at')?->toDateTimeString() ?? now()->toISOString();
        $photoDescription = $request->string('photo_description')->toString() ?: null;
        $checkpointId = $request->has('checkpoint_id') ? (int) $request->integer('checkpoint_id') : null;
        $visibility = $request->string('visibility')->toString() ?: 'public';

        $results = [];
        foreach ($request->file('files') as $file) {
            $dto = UploadDischargePhotoDTO::fromArray([
                'discharge_id' => $discharge->discharge_id,
                'file' => $file,
                'taken_at' => $takenAt,
                'photo_description' => $photoDescription,
                'checkpoint_id' => $checkpointId,
                'visibility' => $visibility,
            ]);

            $p = $this->useCase->execute($dto);
            $results[] = [
                'photo_id' => $p->getPhotoId()?->getValue(),
                'photo_path' => $p->getPhotoPath(),
                'discharge_id' => $p->getDischargeId()->getValue(),
                'checkpoint_id' => $p->getCheckpointId()?->getValue(),
            ];
        }

        return response()->json([
            'message' => 'Photos created and uploaded successfully.',
            'data' => $results,
        ], 201);
    }

    /**
     * List photos for a discharge (paginated via existing SearchPhotosUseCase)
     */
    public function index(int $dischargeId): JsonResponse
    {
        $discharge = Discharge::query()->find($dischargeId);
        if (! $discharge) {
            return response()->json(['error' => 'Discharge not found.'], 404);
        }

        $criteria = PhotoSearchCriteriaDTO::fromArray([
            'discharge_id' => $discharge->discharge_id,
            'page' => request()->integer('page', 1),
            'per_page' => request()->integer('per_page', 15),
        ]);

        $result = $this->searchUseCase->execute($criteria); // domain photos in data

        $temporary = (bool) request()->boolean('temporary', false);
        $expires = (int) request()->integer('expires', 3600);

        /** @var \App\Domain\Storage\Repositories\StorageRepositoryInterface $storage */
        $storage = app(\App\Domain\Storage\Repositories\StorageRepositoryInterface::class);

        $data = array_map(function ($p) use ($temporary, $expires, $storage) {
            $path = $p->getPhotoPath();
            $url = null;
            try {
                $url = $temporary ? $storage->temporaryUrl($path, $expires) : $storage->url($path);
            } catch (\Throwable $e) {
                $url = null;
            }

            return [
                'photo_id' => $p->getPhotoId()?->getValue(),
                'photo_path' => $path,
                'url' => $url,
                'taken_at' => $p->getTakenAt()->toISOString(),
                'photo_description' => $p->getPhotoDescription(),
                'discharge_id' => $p->getDischargeId()->getValue(),
                'survey_id' => $p->getSurveyId()?->getValue(),
                'checkpoint_id' => $p->getCheckpointId()?->getValue(),
                'created_at' => $p->getCreatedAt()?->toISOString(),
                'updated_at' => $p->getUpdatedAt()?->toISOString(),
            ];
        }, $result['data']);

        return response()->json([
            'data' => $data,
            'meta' => [
                'current_page' => $result['current_page'],
                'from' => $result['from'],
                'last_page' => $result['last_page'],
                'path' => $result['path'],
                'per_page' => $result['per_page'],
                'to' => $result['to'],
                'total' => $result['total'],
            ],
        ]);
    }

    /**
     * Get a temporary URL for a given photo id (delegates to generic PhotoController would also be acceptable).
     */
    public function temporaryUrl(int $dischargeId, int $photoId): JsonResponse
    {
        $discharge = Discharge::query()->find($dischargeId);
        if (! $discharge) {
            return response()->json(['error' => 'Discharge not found.'], 404);
        }

        $e = \App\Models\Photo::find($photoId);
        if (! $e || $e->discharge_id !== $discharge->discharge_id) {
            return response()->json(['error' => 'Photo not found.'], 404);
        }

        $expires = request()->integer('expires', 3600);
        $url = $e->temporaryPhotoUrl($expires);

        return response()->json(['data' => ['url' => $url, 'expires_in' => $expires]]);
    }

    /**
     * Delete a photo for a discharge (verifies ownership before delete).
     */
    public function destroy(int $dischargeId, int $photoId): JsonResponse
    {
        $discharge = Discharge::query()->find($dischargeId);
        if (! $discharge) {
            return response()->json(['error' => 'Discharge not found.'], 404);
        }

        $e = \App\Models\Photo::find($photoId);
        if (! $e || $e->discharge_id !== $discharge->discharge_id) {
            return response()->json(['error' => 'Photo not found.'], 404);
        }

        $this->deleteUseCase->execute($photoId);

        return response()->json(['message' => 'Photo deleted successfully.']);
    }
}
