<?php

namespace App\Presentation\Http\Controllers;

use App\Application\PortCall\DTOs\CreatePortCallDTO;
use App\Application\PortCall\DTOs\UpdatePortCallDTO;
use App\Application\PortCall\UseCases\CreatePortCallUseCase;
use App\Application\PortCall\UseCases\DeletePortCallUseCase;
use App\Application\PortCall\UseCases\GetPortCallsUseCase;
use App\Application\PortCall\UseCases\SearchPortCallsUseCase;
use App\Application\PortCall\DTOs\PortCallSearchCriteriaDTO;
use App\Application\PortCall\UseCases\GetPortCallUseCase;
use App\Application\PortCall\UseCases\GetPortCallVehiclesUseCase;
use App\Application\PortCall\UseCases\SearchPortCallVehiclesUseCase;
use App\Application\Vehicle\DTOs\PortCallVehicleSearchCriteriaDTO;
use App\Application\PortCall\UseCases\UpdatePortCallUseCase;
use App\Presentation\Http\Requests\StorePortCallRequest;
use App\Presentation\Http\Requests\UpdatePortCallRequest;
use App\Presentation\Http\Resources\PortCallResource;
use App\Presentation\Http\Requests\SearchPortCallsRequest;
use App\Presentation\Http\Resources\VehicleResource;
use App\Presentation\Http\Requests\SearchPortCallVehiclesRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

final class PortCallController
{
    public function __construct(
        private readonly CreatePortCallUseCase $createUseCase,
        private readonly GetPortCallsUseCase $listUseCase, // legacy simple list (maybe kept for internal usage)
        private readonly SearchPortCallsUseCase $searchUseCase,
        private readonly GetPortCallUseCase $getUseCase,
        private readonly UpdatePortCallUseCase $updateUseCase,
        private readonly DeletePortCallUseCase $deleteUseCase,
    private readonly GetPortCallVehiclesUseCase $getVehiclesUseCase,
    private readonly SearchPortCallVehiclesUseCase $searchVehiclesUseCase,
    ) {}

    public function index(SearchPortCallsRequest $request): JsonResponse
    {
        try {
            $criteria = PortCallSearchCriteriaDTO::fromArray($request->validated());
            $result = $this->searchUseCase->execute($criteria);

            return response()->json([
                'data' => PortCallResource::collection($result['data']),
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
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Failed to fetch port calls.',
                'error' => $e->getMessage(),
            ], 400);
        }
    }

    public function store(StorePortCallRequest $request): JsonResponse
    {
        try {
            $dto = CreatePortCallDTO::fromArray($request->validated());
            $pc = $this->createUseCase->execute($dto);

            return response()->json([
                'message' => 'Port call created successfully.',
                'data' => new PortCallResource($pc),
            ], 201);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Failed to create port call.',
                'error' => $e->getMessage(),
            ], 400);
        }
    }

    public function show(int $id): JsonResponse
    {
        try {
            $pc = $this->getUseCase->execute($id);

            return response()->json(['data' => new PortCallResource($pc)]);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Port call not found.',
                'error' => $e->getMessage(),
            ], 404);
        }
    }

    public function update(UpdatePortCallRequest $request, int $id): JsonResponse
    {
        try {
            $data = $request->validated();
            $data['port_call_id'] = $id;
            $dto = UpdatePortCallDTO::fromArray($data);
            $pc = $this->updateUseCase->execute($dto);

            return response()->json([
                'message' => 'Port call updated successfully.',
                'data' => new PortCallResource($pc),
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Failed to update port call.',
                'error' => $e->getMessage(),
            ], 404);
        }
    }

    public function destroy(int $id): JsonResponse
    {
        try {
            $this->deleteUseCase->execute($id);

            return response()->json(['message' => 'Port call deleted successfully.']);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Failed to delete port call.',
                'error' => $e->getMessage(),
            ], 404);
        }
    }

    public function vehicles(SearchPortCallVehiclesRequest $request, int $id): JsonResponse
    {
        try {
            $criteria = PortCallVehicleSearchCriteriaDTO::fromArray($request->validated(), $id);
            $result = $this->searchVehiclesUseCase->execute($criteria);

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
                'port_call_id' => $id,
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Failed to fetch vehicles for port call.',
                'error' => $e->getMessage(),
            ], 404);
        }
    }
}
