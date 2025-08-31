<?php

namespace App\Presentation\Http\Controllers;

use App\Application\User\DTOs\CreateUserDTO;
use App\Application\User\DTOs\UpdateUsersProfileDTO;
use App\Application\User\DTOs\UserSearchCriteriaDTO;
use App\Application\User\UseCases\CreateUserUseCase;
use App\Application\User\UseCases\DeleteUserUseCase;
use App\Application\User\UseCases\GetUserByMatriculationUseCase;
use App\Application\User\UseCases\GetUsersByInstitutionUseCase;
use App\Application\User\UseCases\GetUserUseCase;
use App\Application\User\UseCases\ImportUsersUseCase;
use App\Application\User\UseCases\SearchUsersUseCase;
use App\Application\User\UseCases\UpdateUserProfileUseCase;
use App\Presentation\Http\Requests\CreateUserRequest;
use App\Presentation\Http\Requests\ImportUsersRequest;
use App\Presentation\Http\Requests\SearchUsersRequest;
use App\Presentation\Http\Requests\UpdateUserRequest;
use App\Presentation\Http\Resources\UserResource;
use Illuminate\Http\JsonResponse;

final class UserController extends Controller
{
    public function __construct(
        private readonly CreateUserUseCase $createUserUseCase,
        private readonly DeleteUserUseCase $deleteUserUseCase,
        private readonly GetUserByMatriculationUseCase $getUserByMatriculationUseCase,
        private readonly GetUserUseCase $getUserUseCase,
        private readonly GetUsersByInstitutionUseCase $getUsersByInstitutionUseCase,
        private readonly SearchUsersUseCase $searchUsersUseCase,
        private readonly UpdateUserProfileUseCase $updateUserProfileUseCase,
    private readonly ImportUsersUseCase $importUsersUseCase,
    ) {}

    public function index(SearchUsersRequest $request): JsonResponse
    {
        try {
            $criteria = UserSearchCriteriaDTO::fromArray($request->validated());
            $users = $this->searchUsersUseCase->execute($criteria);

            return response()->json([
                'data' => UserResource::collection($users['data']),
                'meta' => [
                    'current_page' => $users['current_page'],
                    'from' => $users['from'],
                    'last_page' => $users['last_page'],
                    'path' => $users['path'],
                    'per_page' => $users['per_page'],
                    'to' => $users['to'],
                    'total' => $users['total'],
                ],
            ]);
        } catch (\Exception $exception) {
            return response()->json([
                'error' => $exception->getMessage(),
            ], 400);
        }
    }

    public function store(CreateUserRequest $request): JsonResponse
    {
        try {
            $dto = CreateUserDTO::fromArray($request->validated());
            $user = $this->createUserUseCase->execute($dto);

            return response()->json([
                'message' => 'User created successfully.',
                'data' => new UserResource($user),
            ], 201);
        } catch (\Exception $exception) {
            return response()->json([
                'error' => $exception->getMessage(),
            ], 400);
        }
    }

    public function show(int $userId): JsonResponse
    {
        try {
            $user = $this->getUserUseCase->execute($userId);

            return response()->json([
                'data' => new UserResource($user),
            ]);
        } catch (\Exception $exception) {
            return response()->json([
                'error' => $exception->getMessage(),
            ], 404);
        }
    }

    public function showByMatriculationNumber(string $matriculationNumber): JsonResponse
    {
        try {
            $user = $this->getUserByMatriculationUseCase->execute($matriculationNumber);

            return response()->json([
                'data' => new UserResource($user),
            ]);
        } catch (\Exception $exception) {
            return response()->json([
                'error' => $exception->getMessage(),
            ], 404);
        }
    }

    public function update(UpdateUserRequest $request, int $userId): JsonResponse
    {
        try {
            $data = $request->validated();
            $data['user_id'] = $userId;
            $dto = UpdateUsersProfileDTO::fromArray($data);
            $user = $this->updateUserProfileUseCase->execute($dto);

            return response()->json([
                'message' => 'User updated successfully.',
                'data' => new UserResource($user),
            ], 200);
        } catch (\Exception $exception) {
            $statusCode = $exception->getMessage() === 'User not found.' ? 404 : 400;

            return response()->json([
                'error' => $exception->getMessage(),
            ], $statusCode);
        }
    }

    public function destroy(int $userId): JsonResponse
    {
        try {
            $this->deleteUserUseCase->execute($userId);

            return response()->json([
                'message' => 'User deleted successfully.',
            ], 200);
        } catch (\Exception $exception) {
            $statusCode = $exception->getMessage() === 'User not found.' ? 404 : 400;

            return response()->json([
                'error' => $exception->getMessage(),
            ], $statusCode);
        }
    }

    public function import(ImportUsersRequest $request): JsonResponse
    {
        try {
            $file = $request->file('file');
            $result = $this->importUsersUseCase->execute($file);

            return response()->json([
                'message' => 'Importation terminée avec succès.',
                'data' => [
                    'imported_users' => $result['imported_count'],
                    'skipped_users' => $result['skipped_count'],
                    'total_processed' => $result['total_processed'],
                    'errors' => $result['errors'],
                ],
            ], 200);
        } catch (\Exception $exception) {
            return response()->json([
                'error' => $exception->getMessage(),
            ], 400);
        }
    }

}
