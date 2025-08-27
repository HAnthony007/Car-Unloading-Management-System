<?php

namespace App\Presentation\Http\Controllers;

use App\Application\SurveyCheckpoint\DTOs\CreateSurveyCheckpointDTO;
use App\Application\SurveyCheckpoint\DTOs\SurveyCheckpointSearchCriteriaDTO;
use App\Application\SurveyCheckpoint\DTOs\UpdateSurveyCheckpointDTO;
use App\Application\SurveyCheckpoint\UseCases\CreateSurveyCheckpointUseCase;
use App\Application\SurveyCheckpoint\UseCases\DeleteSurveyCheckpointUseCase;
use App\Application\SurveyCheckpoint\UseCases\GetSurveyCheckpointUseCase;
use App\Application\SurveyCheckpoint\UseCases\ListSurveyCheckpointsUseCase;
use App\Application\SurveyCheckpoint\UseCases\SearchSurveyCheckpointsUseCase;
use App\Application\SurveyCheckpoint\UseCases\UpdateSurveyCheckpointUseCase;
use App\Presentation\Http\Requests\CreateSurveyCheckpointRequest;
use App\Presentation\Http\Requests\SearchSurveyCheckpointsRequest;
use App\Presentation\Http\Requests\UpdateSurveyCheckpointRequest;
use App\Presentation\Http\Resources\SurveyCheckpointResource;
use Illuminate\Http\JsonResponse;

final class SurveyCheckpointController extends Controller
{
    public function __construct(
        private readonly CreateSurveyCheckpointUseCase $createUseCase,
        private readonly DeleteSurveyCheckpointUseCase $deleteUseCase,
        private readonly GetSurveyCheckpointUseCase $getUseCase,
        private readonly ListSurveyCheckpointsUseCase $listUseCase,
        private readonly SearchSurveyCheckpointsUseCase $searchUseCase,
        private readonly UpdateSurveyCheckpointUseCase $updateUseCase,
    ) {}

    public function index(SearchSurveyCheckpointsRequest $request): JsonResponse
    {
        try {
            $criteria = SurveyCheckpointSearchCriteriaDTO::fromArray($request->validated());
            $result = $this->searchUseCase->execute($criteria);

            $withPhotos = (bool) ($request->validated()['with_photos'] ?? false);

            $data = $withPhotos
                ? array_map(function ($c) {
                    // Eager load photos via model for now
                    $eloquent = \App\Models\SurveyCheckpoint::with('photos')->find($c->getCheckpointId()?->getValue());

                    return [
                        'checkpoint' => new SurveyCheckpointResource($c),
                        'photos' => $eloquent?->photos?->map(fn ($p) => new \App\Presentation\Http\Resources\PhotoResource($p))->toArray() ?? [],
                    ];
                }, $result['data'])
                : SurveyCheckpointResource::collection($result['data']);

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
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    public function store(CreateSurveyCheckpointRequest $request): JsonResponse
    {
        try {
            $dto = CreateSurveyCheckpointDTO::fromArray($request->validated());
            $entity = $this->createUseCase->execute($dto);

            return response()->json([
                'message' => 'SurveyCheckpoint created successfully.',
                'data' => new SurveyCheckpointResource($entity),
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    public function show(int $id): JsonResponse
    {
        try {
            $entity = $this->getUseCase->execute($id);

            return response()->json(['data' => new SurveyCheckpointResource($entity)]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 404);
        }
    }

    public function update(UpdateSurveyCheckpointRequest $request, int $id): JsonResponse
    {
        try {
            $data = $request->validated();
            $data['checkpoint_id'] = $id;
            $dto = UpdateSurveyCheckpointDTO::fromArray($data);
            $entity = $this->updateUseCase->execute($dto);

            return response()->json([
                'message' => 'SurveyCheckpoint updated successfully.',
                'data' => new SurveyCheckpointResource($entity),
            ]);
        } catch (\Exception $e) {
            $status = $e->getMessage() === 'SurveyCheckpoint not found.' ? 404 : 400;

            return response()->json(['error' => $e->getMessage()], $status);
        }
    }

    public function destroy(int $id): JsonResponse
    {
        try {
            $this->deleteUseCase->execute($id);

            return response()->json(['message' => 'SurveyCheckpoint deleted successfully.']);
        } catch (\Exception $e) {
            $status = $e->getMessage() === 'SurveyCheckpoint not found.' ? 404 : 400;

            return response()->json(['error' => $e->getMessage()], $status);
        }
    }
}
