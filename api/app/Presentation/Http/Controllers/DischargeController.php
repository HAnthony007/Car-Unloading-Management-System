<?php

namespace App\Presentation\Http\Controllers;

use App\Application\Discharge\DTOs\CreateDischargeDTO;
use App\Application\Discharge\DTOs\UpdateDischargeDTO;
use App\Application\Discharge\UseCases\CreateDischargeUseCase;
use App\Application\Discharge\UseCases\DeleteDischargeUseCase;
use App\Application\Discharge\UseCases\GetDischargesByPortCallUseCase;
use App\Application\Discharge\UseCases\GetDischargesUseCase;
use App\Application\Discharge\UseCases\GetDischargeUseCase;
use App\Application\Discharge\UseCases\UpdateDischargeUseCase;
use App\Presentation\Http\Requests\StoreDischargeRequest;
use App\Presentation\Http\Requests\UpdateDischargeRequest;
use App\Presentation\Http\Resources\DischargeResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

final class DischargeController
{
    public function __construct(
        private readonly CreateDischargeUseCase $createUseCase,
        private readonly GetDischargesUseCase $listUseCase,
        private readonly GetDischargeUseCase $getUseCase,
        private readonly UpdateDischargeUseCase $updateUseCase,
        private readonly DeleteDischargeUseCase $deleteUseCase,
        private readonly GetDischargesByPortCallUseCase $listByPortCallUseCase,
    ) {}

    public function index(): AnonymousResourceCollection
    {
        return DischargeResource::collection($this->listUseCase->execute());
    }

    public function byPortCall(int $portCallId): AnonymousResourceCollection
    {
        return DischargeResource::collection($this->listByPortCallUseCase->execute($portCallId));
    }

    public function store(StoreDischargeRequest $request): JsonResponse
    {
        try {
            $dto = CreateDischargeDTO::fromArray($request->validated());
            $d = $this->createUseCase->execute($dto);

            return response()->json([
                'message' => 'Discharge created successfully.',
                'data' => new DischargeResource($d),
            ], 201);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Failed to create discharge.',
                'error' => $e->getMessage(),
            ], 400);
        }
    }

    public function show(int $id): JsonResponse
    {
        try {
            $d = $this->getUseCase->execute($id);

            return response()->json(['data' => new DischargeResource($d)]);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Discharge not found.',
                'error' => $e->getMessage(),
            ], 404);
        }
    }

    public function update(UpdateDischargeRequest $request, int $id): JsonResponse
    {
        try {
            $data = $request->validated();
            $data['discharge_id'] = $id;
            $dto = UpdateDischargeDTO::fromArray($data);
            $d = $this->updateUseCase->execute($dto);

            return response()->json([
                'message' => 'Discharge updated successfully.',
                'data' => new DischargeResource($d),
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Failed to update discharge.',
                'error' => $e->getMessage(),
            ], 404);
        }
    }

    public function destroy(int $id): JsonResponse
    {
        try {
            $this->deleteUseCase->execute($id);

            return response()->json(['message' => 'Discharge deleted successfully.']);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Failed to delete discharge.',
                'error' => $e->getMessage(),
            ], 404);
        }
    }
}
