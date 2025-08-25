<?php

namespace App\Presentation\Http\Controllers;

use App\Application\Role\DTOs\CreateRoleDTO;
use App\Application\Role\UseCases\CreateRoleUseCase;
use App\Application\Role\UseCases\GetRoleUseCase;
use App\Application\Role\UseCases\GetRolesUseCase;
use App\Application\Role\UseCases\UpdateRoleUseCase;
use App\Application\Role\UseCases\DeleteRoleUseCase;
use App\Presentation\Http\Resources\RoleResource;
use App\Presentation\Http\Requests\StoreRoleRequest;
use App\Presentation\Http\Requests\UpdateRoleRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Illuminate\Routing\Controller;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;

class RoleController extends Controller
{
    public function __construct(
        private readonly GetRolesUseCase $getRolesUseCase,
        private readonly CreateRoleUseCase $createRoleUseCase,
        private readonly GetRoleUseCase $getRoleUseCase,
        private readonly UpdateRoleUseCase $updateRoleUseCase,
        private readonly DeleteRoleUseCase $deleteRoleUseCase,
    ) {}
    /**
     * Display a listing of the roles.
     */
    public function index(): JsonResponse
    {
        try {
            $roles = $this->getRolesUseCase->execute();

            return response()->json([
                'data' => RoleResource::collection($roles),
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    /**
     * Store a newly created role in storage.
     */
    public function store(StoreRoleRequest $request): JsonResponse
    {
        try {
            $dto = CreateRoleDTO::fromArray($request->validated());
            $role = $this->createRoleUseCase->execute($dto);

            return response()->json([
                'data' => new RoleResource($role),
            ], SymfonyResponse::HTTP_CREATED);
        } catch (\RuntimeException $e) {
            return response()->json(['error' => $e->getMessage()], SymfonyResponse::HTTP_UNPROCESSABLE_ENTITY);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    /**
     * Display the specified role.
     */
    public function show(int $id): JsonResponse
    {
        try {
            $role = $this->getRoleUseCase->execute($id);

            return response()->json([
                'data' => new RoleResource($role),
            ]);
        } catch (\RuntimeException $e) {
            return response()->json(['error' => $e->getMessage()])->setStatusCode(SymfonyResponse::HTTP_NOT_FOUND);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()])->setStatusCode(400);
        }
    }

    /**
     * Update the specified role in storage.
     */
    public function update(UpdateRoleRequest $request, int $id): JsonResponse
    {
        try {
            $dto = CreateRoleDTO::fromArray($request->validated());
            $role = $this->updateRoleUseCase->execute($id, $dto);

            return response()->json([
                'message' => 'Role updated successfully.',
                'data' => new RoleResource($role),
            ], 200);
        } catch (\RuntimeException $e) {
            $status = $e->getMessage() === 'Role not found' ? SymfonyResponse::HTTP_NOT_FOUND : SymfonyResponse::HTTP_UNPROCESSABLE_ENTITY;
            return response()->json(['error' => $e->getMessage()], $status);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    /**
     * Remove the specified role from storage.
     */
    public function destroy(int $id): Response
    {
        try {
            $this->deleteRoleUseCase->execute($id);

            return response()->noContent();
        } catch (\RuntimeException $e) {
            return response(['error' => $e->getMessage()], SymfonyResponse::HTTP_NOT_FOUND);
        } catch (\Exception $e) {
            return response(['error' => $e->getMessage()], 400);
        }
    }
}
