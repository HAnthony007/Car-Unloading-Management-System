<?php

namespace App\Presentation\Http\Controllers;

use App\Application\Dock\UseCases\CreateDockUseCase;
use App\Application\Dock\UseCases\GetDockUseCase;
use App\Application\Dock\UseCases\GetDocksUseCase;
use App\Application\Dock\UseCases\UpdateDockUseCase;
use App\Application\Dock\UseCases\DeleteDockUseCase;
use App\Application\Dock\DTOs\CreateDockDTO;
use App\Application\Dock\DTOs\UpdateDockDTO;
use App\Presentation\Http\Requests\StoreDockRequest;
use App\Presentation\Http\Requests\UpdateDockRequest;
use App\Presentation\Http\Resources\DockResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

final class DockController
{
    public function __construct(
        private readonly CreateDockUseCase $createDockUseCase,
        private readonly GetDocksUseCase $getDocksUseCase,
        private readonly GetDockUseCase $getDockUseCase,
        private readonly UpdateDockUseCase $updateDockUseCase,
        private readonly DeleteDockUseCase $deleteDockUseCase
    ) {}

    public function index(): AnonymousResourceCollection
    {
        $docks = $this->getDocksUseCase->execute();
        return DockResource::collection($docks);
    }

    public function store(StoreDockRequest $request): JsonResponse
    {
        try {
            $dto = CreateDockDTO::fromArray($request->validated());
            $dock = $this->createDockUseCase->execute($dto);
            return response()->json([
                'message' => 'Dock created successfully.',
                'data' => new DockResource($dock)
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to create dock.',
                'error' => $e->getMessage()
            ], 400);
        }
    }

    public function show(int $id): JsonResponse
    {
        try {
            $dock = $this->getDockUseCase->execute($id);
            return response()->json(['data' => new DockResource($dock)]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Dock not found.',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    public function update(UpdateDockRequest $request, int $id): JsonResponse
    {
        try {
            $data = $request->validated();
            $data['dock_id'] = $id;
            $dto = UpdateDockDTO::fromArray($data);
            $dock = $this->updateDockUseCase->execute($dto);
            return response()->json([
                'message' => 'Dock updated successfully.',
                'data' => new DockResource($dock)
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update dock.',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    public function destroy(int $id): JsonResponse
    {
        try {
            $this->deleteDockUseCase->execute($id);
            return response()->json(['message' => 'Dock deleted successfully.']);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to delete dock.',
                'error' => $e->getMessage()
            ], 404);
        }
    }
}
