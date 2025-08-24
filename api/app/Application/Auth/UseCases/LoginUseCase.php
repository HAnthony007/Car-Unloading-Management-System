<?php

namespace App\Application\Auth\UseCases;

use App\Application\Auth\DTOs\LoginDTO;
use App\Domain\User\Repositories\UserRepositoryInterface;
use App\Models\User as EloquentUser;

final class LoginUseCase
{
    public function __construct(private readonly UserRepositoryInterface $userRepository) {}

    /**
     * Return ['user' => DomainUser, 'token' => string]
     */
    public function execute(LoginDTO $dto): array
    {
        $user = $this->userRepository->findByEmail(new \App\Domain\Auth\ValueObjects\Email($dto->email));

        if (!$user) {
            throw \Illuminate\Validation\ValidationException::withMessages([
                'email' => ["Cette adresse email n\'est pas enregistrée."],
            ]);
        }

        if (!password_verify($dto->password, $user->getHashedPassword())) {
            throw \Illuminate\Validation\ValidationException::withMessages([
                'password' => ['Mot de passe incorrect.'],
            ]);
        }

        $eloquent = EloquentUser::where('user_id', $user->getUserId()?->getValue())->first();
        if (!$eloquent) {
            throw new \RuntimeException('Failed to retrieve user model for token creation.');
        }

        $token = $eloquent->createToken('api-token')->plainTextToken;

        return [
            'user' => $user,
            'token' => $token,
        ];
    }
}
