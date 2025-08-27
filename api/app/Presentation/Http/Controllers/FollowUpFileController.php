<?php

namespace App\Presentation\Http\Controllers;

use App\Application\FollowUpFile\DTOs\CreateFollowUpFileDTO;
use App\Application\FollowUpFile\DTOs\FollowUpFileSearchCriteriaDTO;
use App\Application\FollowUpFile\DTOs\UpdateFollowUpFileDTO;
use App\Application\FollowUpFile\UseCases\CreateFollowUpFileUseCase;
use App\Application\FollowUpFile\UseCases\DeleteFollowUpFileUseCase;
use App\Application\FollowUpFile\UseCases\GetFollowUpFileUseCase;
use App\Application\FollowUpFile\UseCases\SearchFollowUpFilesUseCase;
use App\Application\FollowUpFile\UseCases\UpdateFollowUpFileUseCase;
use App\Presentation\Http\Requests\SearchFollowUpFilesRequest;
use App\Presentation\Http\Requests\StoreFollowUpFileRequest;
use App\Presentation\Http\Requests\UpdateFollowUpFileRequest;
use App\Presentation\Http\Resources\FollowUpFileResource;
use Illuminate\Http\JsonResponse;

final class FollowUpFileController extends Controller
{
    public function __construct(
        private readonly CreateFollowUpFileUseCase $createUseCase,
        private readonly GetFollowUpFileUseCase $getUseCase,
        private readonly SearchFollowUpFilesUseCase $searchUseCase,
        private readonly UpdateFollowUpFileUseCase $updateUseCase,
        private readonly DeleteFollowUpFileUseCase $deleteUseCase,
    ) {}

    public function index(SearchFollowUpFilesRequest $request): JsonResponse
    {
        $criteria = FollowUpFileSearchCriteriaDTO::fromArray($request->validated());
        $result = $this->searchUseCase->execute($criteria);

        return response()->json([
            'data' => FollowUpFileResource::collection($result['data']),
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

    public function store(StoreFollowUpFileRequest $request): JsonResponse
    {
        try {
            $dto = CreateFollowUpFileDTO::fromArray($request->validated());
            $entity = $this->createUseCase->execute($dto);

            return response()->json([
                'message' => 'FollowUpFile created successfully.',
                'data' => new FollowUpFileResource($entity),
            ], 201);
        } catch (\Throwable $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    public function show(int $id): JsonResponse
    {
        try {
            $entity = $this->getUseCase->execute($id);

            return response()->json(['data' => new FollowUpFileResource($entity)]);
        } catch (\Throwable $e) {
            return response()->json(['error' => $e->getMessage()], 404);
        }
    }

    public function update(UpdateFollowUpFileRequest $request, int $id): JsonResponse
    {
        try {
            $data = $request->validated();
            $data['follow_up_file_id'] = $id;
            $dto = UpdateFollowUpFileDTO::fromArray($data);
            $entity = $this->updateUseCase->execute($dto);

            return response()->json([
                'message' => 'FollowUpFile updated successfully.',
                'data' => new FollowUpFileResource($entity),
            ]);
        } catch (\Throwable $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    public function destroy(int $id): JsonResponse
    {
        try {
            $this->deleteUseCase->execute($id);

            return response()->json(['message' => 'FollowUpFile deleted successfully.']);
        } catch (\Throwable $e) {
            return response()->json(['error' => $e->getMessage()], 404);
        }
    }
}
