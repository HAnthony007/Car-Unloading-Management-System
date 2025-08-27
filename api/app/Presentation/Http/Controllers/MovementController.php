<?php

namespace App\Presentation\Http\Controllers;

use App\Application\Movement\DTOs\CreateMovementDTO;
use App\Application\Movement\DTOs\MovementSearchCriteriaDTO;
use App\Application\Movement\DTOs\UpdateMovementDTO;
use App\Application\Movement\UseCases\CreateMovementUseCase;
use App\Application\Movement\UseCases\DeleteMovementUseCase;
use App\Application\Movement\UseCases\GetMovementUseCase;
use App\Application\Movement\UseCases\SearchMovementsUseCase;
use App\Application\Movement\UseCases\UpdateMovementUseCase;
use App\Presentation\Http\Requests\SearchMovementsRequest;
use App\Presentation\Http\Requests\StoreMovementRequest;
use App\Presentation\Http\Requests\UpdateMovementRequest;
use App\Presentation\Http\Resources\MovementResource;
use Illuminate\Http\JsonResponse;

final class MovementController
{
    public function __construct(
        private readonly CreateMovementUseCase $createUseCase,
        private readonly GetMovementUseCase $getUseCase,
        private readonly UpdateMovementUseCase $updateUseCase,
        private readonly DeleteMovementUseCase $deleteUseCase,
        private readonly SearchMovementsUseCase $searchUseCase,
    ) {}

    public function index(SearchMovementsRequest $request): JsonResponse
    {
        $criteria = MovementSearchCriteriaDTO::fromArray($request->validated());
        $result = $this->searchUseCase->execute($criteria);

        return response()->json([
            'data' => MovementResource::collection($result['data']),
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

    public function byVehicle(int $id, SearchMovementsRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['vehicle_id'] = $id;
        $criteria = MovementSearchCriteriaDTO::fromArray($data);
        $result = $this->searchUseCase->execute($criteria);

        return response()->json([
            'data' => MovementResource::collection($result['data']),
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

    public function store(StoreMovementRequest $request): JsonResponse
    {
        try {
            $dto = CreateMovementDTO::fromArray($request->validated());
            $movement = $this->createUseCase->execute($dto);

            return response()->json([
                'message' => 'Movement created successfully.',
                'data' => new MovementResource($movement),
            ], 201);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Failed to create movement.',
                'error' => $e->getMessage(),
            ], 400);
        }
    }

    public function show(int $id): JsonResponse
    {
        try {
            $movement = $this->getUseCase->execute($id);

            return response()->json(['data' => new MovementResource($movement)]);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Movement not found.',
                'error' => $e->getMessage(),
            ], 404);
        }
    }

    public function update(UpdateMovementRequest $request, int $id): JsonResponse
    {
        try {
            $data = $request->validated();
            $data['movement_id'] = $id;
            $dto = UpdateMovementDTO::fromArray($data);
            $movement = $this->updateUseCase->execute($dto);

            return response()->json([
                'message' => 'Movement updated successfully.',
                'data' => new MovementResource($movement),
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Failed to update movement.',
                'error' => $e->getMessage(),
            ], 404);
        }
    }

    public function destroy(int $id): JsonResponse
    {
        try {
            $this->deleteUseCase->execute($id);

            return response()->json(['message' => 'Movement deleted successfully.']);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Failed to delete movement.',
                'error' => $e->getMessage(),
            ], 404);
        }
    }
}
