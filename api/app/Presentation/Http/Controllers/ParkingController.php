<?php

namespace App\Presentation\Http\Controllers;

use App\Application\Parking\UseCases\CreateParkingUseCase;
use App\Application\Parking\UseCases\GetParkingUseCase;
use App\Application\Parking\UseCases\GetParkingsUseCase;
use App\Application\Parking\UseCases\UpdateParkingUseCase;
use App\Application\Parking\UseCases\DeleteParkingUseCase;
use App\Application\Parking\DTOs\CreateParkingDTO;
use App\Application\Parking\DTOs\UpdateParkingDTO;
use App\Presentation\Http\Requests\StoreParkingRequest;
use App\Presentation\Http\Requests\UpdateParkingRequest;
use App\Presentation\Http\Resources\ParkingResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

final class ParkingController
{
    public function __construct(
        private readonly CreateParkingUseCase $createParkingUseCase,
        private readonly GetParkingsUseCase $getParkingsUseCase,
        private readonly GetParkingUseCase $getParkingUseCase,
        private readonly UpdateParkingUseCase $updateParkingUseCase,
        private readonly DeleteParkingUseCase $deleteParkingUseCase
    ) {}

    public function index(): AnonymousResourceCollection
    {
        $parkings = $this->getParkingsUseCase->execute();
        
        return ParkingResource::collection($parkings);
    }

    public function store(StoreParkingRequest $request): JsonResponse
    {
        try {
            $dto = CreateParkingDTO::fromArray($request->validated());
            $parking = $this->createParkingUseCase->execute($dto);
            
            return response()->json([
                'message' => 'Parking created successfully.',
                'data' => new ParkingResource($parking)
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to create parking.',
                'error' => $e->getMessage()
            ], 400);
        }
    }

    public function show(int $parkingId): JsonResponse
    {
        try {
            $parking = $this->getParkingUseCase->execute($parkingId);
            
            return response()->json([
                'data' => new ParkingResource($parking)
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Parking not found.',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    public function update(UpdateParkingRequest $request, int $parkingId): JsonResponse
    {
        try {
            $validatedData = $request->validated();
            $validatedData['parking_id'] = $parkingId;
            $dto = UpdateParkingDTO::fromArray($validatedData);
            $parking = $this->updateParkingUseCase->execute($dto);
            
            return response()->json([
                'message' => 'Parking updated successfully.',
                'data' => new ParkingResource($parking)
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update parking.',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    public function destroy(int $parkingId): JsonResponse
    {
        try {
            $this->deleteParkingUseCase->execute($parkingId);
            
            return response()->json([
                'message' => 'Parking deleted successfully.'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to delete parking.',
                'error' => $e->getMessage()
            ], 404);
        }
    }
}
