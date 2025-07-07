<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\LoginRequest;
use App\Services\AuthService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AuthController extends Controller
{
    public function __construct(private AuthService $authService) {}

    public function register(RegisterRequest $request): JsonResponse
    {
        $data = $this->authService->register($request->validated());
        return response()->json([
            'success' => true,
            'message' => 'User registered successfully',
            'data' => $data,
        ]);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $data = $this->authService->login($request->validated());
        return response()->json([
            'success' => true,
            'message' => 'User logged in successfully',
            'data' => $data,
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $this->authService->logout();
        return response()->json([
            'success' => true,
            'message' => 'User logged out successfully',
        ]);
    }
}
