<?php

namespace App\Presentation\Http\Controllers;

use App\Application\Auth\DTOs\LoginDTO;
use App\Application\Auth\DTOs\RegisterDTO;
use App\Application\Auth\UseCases\LoginUseCase;
use App\Application\Auth\UseCases\LogoutUseCase;
use App\Application\Auth\UseCases\RegisterUseCase;
use App\Presentation\Http\Requests\Auth\LoginRequest;
use App\Presentation\Http\Requests\Auth\RegisterRequest;
use App\Presentation\Http\Resources\UserResource;
use Illuminate\Http\JsonResponse;

final class AuthController extends Controller
{
    public function __construct(
        private readonly RegisterUseCase $registerUseCase,
        private readonly LoginUseCase $loginUseCase,
        private readonly LogoutUseCase $logoutUseCase,
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
}
