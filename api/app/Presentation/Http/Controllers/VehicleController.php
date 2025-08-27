<?php

namespace App\Presentation\Http\Controllers;

use App\Application\Vehicle\DTOs\CreateVehicleDTO;
use App\Application\Vehicle\DTOs\UpdateVehicleDTO;
use App\Application\Vehicle\UseCases\CreateVehicleUseCase;
use App\Application\Vehicle\UseCases\DeleteVehicleUseCase;
use App\Application\Vehicle\UseCases\GetVehiclesUseCase;
use App\Application\Vehicle\UseCases\GetVehicleUseCase;
use App\Application\Vehicle\UseCases\SearchVehiclesUseCase;
use App\Application\Vehicle\UseCases\UpdateVehicleUseCase;
use App\Presentation\Http\Requests\SearchVehiclesRequest;
use App\Presentation\Http\Requests\StoreVehicleRequest;
use App\Presentation\Http\Requests\UpdateVehicleRequest;
use App\Presentation\Http\Resources\VehicleResource;
use Illuminate\Http\JsonResponse;

final class VehicleController
{
    public function __construct(
        private readonly CreateVehicleUseCase $createUseCase,
        private readonly GetVehiclesUseCase $listUseCase,
        private readonly GetVehicleUseCase $getUseCase,
        private readonly UpdateVehicleUseCase $updateUseCase,
        private readonly DeleteVehicleUseCase $deleteUseCase,
        private readonly SearchVehiclesUseCase $searchUseCase,
    ) {}

    public function index(SearchVehiclesRequest $request): \Illuminate\Http\JsonResponse
    {
        $criteria = \App\Application\Vehicle\DTOs\VehicleSearchCriteriaDTO::fromArray($request->validated());
        $result = $this->searchUseCase->execute($criteria);

        return response()->json([
            'data' => VehicleResource::collection($result['data']),
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

    public function store(StoreVehicleRequest $request): JsonResponse
    {
        try {
            $dto = CreateVehicleDTO::fromArray($request->validated());
            $vehicle = $this->createUseCase->execute($dto);

            return response()->json([
                'message' => 'Vehicle created successfully.',
                'data' => new VehicleResource($vehicle),
            ], 201);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Failed to create vehicle.',
                'error' => $e->getMessage(),
            ], 400);
        }
    }

    public function show(int $id): JsonResponse
    {
        try {
            $vehicle = $this->getUseCase->execute($id);

            return response()->json(['data' => new VehicleResource($vehicle)]);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Vehicle not found.',
                'error' => $e->getMessage(),
            ], 404);
        }
    }

    public function update(UpdateVehicleRequest $request, int $id): JsonResponse
    {
        try {
            $data = $request->validated();
            $data['vehicle_id'] = $id;
            $dto = UpdateVehicleDTO::fromArray($data);
            $vehicle = $this->updateUseCase->execute($dto);

            return response()->json([
                'message' => 'Vehicle updated successfully.',
                'data' => new VehicleResource($vehicle),
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Failed to update vehicle.',
                'error' => $e->getMessage(),
            ], 404);
        }
    }

    public function destroy(int $id): JsonResponse
    {
        try {
            $this->deleteUseCase->execute($id);

            return response()->json(['message' => 'Vehicle deleted successfully.']);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Failed to delete vehicle.',
                'error' => $e->getMessage(),
            ], 404);
        }
    }
}
