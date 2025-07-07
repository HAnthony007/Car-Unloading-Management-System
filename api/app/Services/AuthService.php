<?php

namespace App\Services;

use App\DTOs\UserDTO;
use App\Repositories\UserRepository;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class AuthService
{

    public function __construct(private UserRepository $userRepository) {}

    public function register(array $data): array
    {
        $user = $this->userRepository->create($data);
        $token = $user->createToken("api-token")->plainTextToken;

        if (!$user) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        return [
            'user' => (new UserDTO($user))->toArrray(),
            'token' => $token,
        ];
    }

    public function login(array $credentials): array
    {
        $user = $this->userRepository->findByEmail($credentials['email']);

        if (!$user || !password_verify($credentials['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Email or password is incorrect.'],
            ]);
        }

        $token = $user->createToken("api-token")->plainTextToken;
        return [
            'user' => (new UserDTO($user))->toArrray(),
            'token' => $token,
        ];
    }

    public function logout(): void
    {
        Auth::user()->currentAccessToken()->delete();
    }
}
