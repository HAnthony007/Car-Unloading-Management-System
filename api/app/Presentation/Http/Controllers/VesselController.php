<?php

namespace App\Presentation\Http\Controllers;

use App\Application\Vessel\DTOs\CreateVesselDTO;
use App\Application\Vessel\DTOs\UpdateVesselDTO;
use App\Application\Vessel\UseCases\CreateVesselUseCase;
use App\Application\Vessel\UseCases\DeleteVesselUseCase;
use App\Application\Vessel\UseCases\GetVesselsUseCase;
use App\Application\Vessel\UseCases\GetVesselUseCase;
use App\Application\Vessel\UseCases\UpdateVesselUseCase;
use App\Presentation\Http\Requests\StoreVesselRequest;
use App\Presentation\Http\Requests\UpdateVesselRequest;
use App\Presentation\Http\Resources\VesselResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

final class VesselController
{
    public function __construct(
        private readonly CreateVesselUseCase $createUseCase,
        private readonly GetVesselsUseCase $listUseCase,
        private readonly GetVesselUseCase $getUseCase,
        private readonly UpdateVesselUseCase $updateUseCase,
        private readonly DeleteVesselUseCase $deleteUseCase,
    ) {}

    public function index(): AnonymousResourceCollection
    {
        $vessels = $this->listUseCase->execute();

        return VesselResource::collection($vessels);
    }

    public function store(StoreVesselRequest $request): JsonResponse
    {
        try {
            $dto = CreateVesselDTO::fromArray($request->validated());
            $vessel = $this->createUseCase->execute($dto);

            return response()->json([
                'message' => 'Vessel created successfully.',
                'data' => new VesselResource($vessel),
            ], 201);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Failed to create vessel.',
                'error' => $e->getMessage(),
            ], 400);
        }
    }

    public function show(int $id): JsonResponse
    {
        try {
            $vessel = $this->getUseCase->execute($id);

            return response()->json(['data' => new VesselResource($vessel)]);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Vessel not found.',
                'error' => $e->getMessage(),
            ], 404);
        }
    }

    public function update(UpdateVesselRequest $request, int $id): JsonResponse
    {
        try {
            $data = $request->validated();
            $data['vessel_id'] = $id;
            $dto = UpdateVesselDTO::fromArray($data);
            $vessel = $this->updateUseCase->execute($dto);

            return response()->json([
                'message' => 'Vessel updated successfully.',
                'data' => new VesselResource($vessel),
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Failed to update vessel.',
                'error' => $e->getMessage(),
            ], 404);
        }
    }

    public function destroy(int $id): JsonResponse
    {
        try {
            $this->deleteUseCase->execute($id);

            return response()->json(['message' => 'Vessel deleted successfully.']);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Failed to delete vessel.',
                'error' => $e->getMessage(),
            ], 404);
        }
    }
}
