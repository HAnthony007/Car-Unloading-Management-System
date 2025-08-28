<?php

namespace App\Presentation\Http\Controllers;

use App\Application\Auth\DTOs\LoginDTO;
use App\Application\Auth\DTOs\RegisterDTO;
use App\Application\Auth\UseCases\LoginUseCase;
use App\Application\Auth\UseCases\LogoutUseCase;
use App\Application\Auth\UseCases\RegisterUseCase;
use App\Application\User\UseCases\GetUserUseCase;
use App\Presentation\Http\Requests\Auth\LoginRequest;
use App\Presentation\Http\Requests\Auth\RegisterRequest;
use App\Presentation\Http\Resources\UserResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class AuthController extends Controller
{
    public function __construct(
        private readonly RegisterUseCase $registerUseCase,
        private readonly LoginUseCase $loginUseCase,
        private readonly LogoutUseCase $logoutUseCase,
        private readonly GetUserUseCase $getUserUseCase,
    ) {}

    public function register(RegisterRequest $request): JsonResponse
    {
        try {

            $dto = RegisterDTO::fromArray($request->validated());
            $result = $this->registerUseCase->execute($dto);

            return response()->json([
                'message' => 'User registered successfully.',
                'data' => [
                    'user' => new UserResource($result['user']),
                    'token' => $result['token'],
                ],
            ], 201);
        } catch (\Exception $exception) {
            return response()->json([
                'error' => $exception->getMessage(),
            ], 400);
        }
    }

    public function login(LoginRequest $request): JsonResponse
    {
        try {
            $dto = LoginDTO::fromArray($request->validated());
            $result = $this->loginUseCase->execute($dto);

            return response()->json([
                'message' => 'User logged in successfully.',
                'data' => [
                    'user' => new UserResource($result['user']),
                    'token' => $result['token'],
                ],
            ], 200);
        } catch (\Exception $exception) {
            return response()->json([
                'error' => $exception->getMessage(),
            ], 400);
        }
    }

    public function logout(): JsonResponse
    {
        try {
            $this->logoutUseCase->execute();

            return response()->json([
                'message' => 'User logged out successfully.',
            ], 200);
        } catch (\Exception $exception) {
            return response()->json([
                'error' => $exception->getMessage(),
            ], 400);
        }
    }

    /**
     * Return the currently authenticated user.
     */
    public function me(Request $request): JsonResponse
    {
        try {
            $user = $request->user();

            if ($user === null) {
                return response()->json([
                    'error' => 'Unauthenticated.',
                ], 401);
            }

            // Fetch domain user to feed UserResource correctly
            $domainUser = $this->getUserUseCase->execute($user->getKey());

            return response()->json([
                'message' => 'Authenticated user retrieved successfully.',
                'data' => [
                    'user' => new UserResource($domainUser),
                ],
            ], 200);
        } catch (\Exception $exception) {
            return response()->json([
                'error' => $exception->getMessage(),
            ], 400);
        }
    }
}
