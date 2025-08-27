<?php

namespace App\Presentation\Http\Controllers;

use App\Application\Photo\DTOs\CreatePhotoDTO;
use App\Application\Photo\DTOs\PhotoSearchCriteriaDTO;
use App\Application\Photo\DTOs\UpdatePhotoDTO;
use App\Application\Photo\UseCases\CreatePhotoUseCase;
use App\Application\Photo\UseCases\DeletePhotoUseCase;
use App\Application\Photo\UseCases\GetPhotoUseCase;
use App\Application\Photo\UseCases\SearchPhotosUseCase;
use App\Application\Photo\UseCases\UpdatePhotoUseCase;
use App\Presentation\Http\Requests\SearchPhotosRequest;
use App\Presentation\Http\Requests\StorePhotoRequest;
use App\Presentation\Http\Requests\UpdatePhotoRequest;
use App\Presentation\Http\Resources\DomainPhotoResource;
use Illuminate\Http\JsonResponse;

final class PhotoController extends Controller
{
    public function __construct(
        private readonly CreatePhotoUseCase $createUseCase,
        private readonly GetPhotoUseCase $getUseCase,
        private readonly SearchPhotosUseCase $searchUseCase,
        private readonly UpdatePhotoUseCase $updateUseCase,
        private readonly DeletePhotoUseCase $deleteUseCase,
    ) {}

    public function index(SearchPhotosRequest $request): JsonResponse
    {
        $criteria = PhotoSearchCriteriaDTO::fromArray($request->validated());

        $result = $this->searchUseCase->execute($criteria);

        return response()->json([
            'data' => DomainPhotoResource::collection($result['data']),
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

    public function store(StorePhotoRequest $request): JsonResponse
    {
        try {
            $dto = CreatePhotoDTO::fromArray($request->validated());
            $entity = $this->createUseCase->execute($dto);

            return response()->json([
                'message' => 'Photo created successfully.',
                'data' => new DomainPhotoResource($entity),
            ], 201);
        } catch (\Throwable $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    public function show(int $id): JsonResponse
    {
        try {
            $entity = $this->getUseCase->execute($id);

            return response()->json(['data' => new DomainPhotoResource($entity)]);
        } catch (\Throwable $e) {
            return response()->json(['error' => $e->getMessage()], 404);
        }
    }

    public function update(UpdatePhotoRequest $request, int $id): JsonResponse
    {
        try {
            $data = $request->validated();
            $data['photo_id'] = $id;
            $dto = UpdatePhotoDTO::fromArray($data);
            $entity = $this->updateUseCase->execute($dto);

            return response()->json([
                'message' => 'Photo updated successfully.',
                'data' => new DomainPhotoResource($entity),
            ]);
        } catch (\Throwable $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    public function destroy(int $id): JsonResponse
    {
        try {
            $this->deleteUseCase->execute($id);

            return response()->json(['message' => 'Photo deleted successfully.']);
        } catch (\Throwable $e) {
            return response()->json(['error' => $e->getMessage()], 404);
        }
    }
}
