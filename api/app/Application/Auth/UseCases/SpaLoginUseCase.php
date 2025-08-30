<?php

namespace App\Application\Auth\UseCases;

use App\Application\Auth\DTOs\LoginDTO;
use App\Domain\User\Entities\User as DomainUser;
use App\Domain\User\Repositories\UserRepositoryInterface;

final class SpaLoginUseCase
{
    public function __construct(private readonly UserRepositoryInterface $userRepository) {}

    /**
     * Validate email and password using the domain repository and return the Domain User.
     *
     * @return DomainUser
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function execute(LoginDTO $dto): DomainUser
    {
        $user = $this->userRepository->findByEmail(new \App\Domain\Auth\ValueObjects\Email($dto->email));

        if (! $user) {
            throw \Illuminate\Validation\ValidationException::withMessages([
                'email' => ['This email address is not registered.'],
            ]);
        }

        if (! password_verify($dto->password, $user->getHashedPassword())) {
            throw \Illuminate\Validation\ValidationException::withMessages([
                'password' => ['Incorrect password.'],
            ]);
        }

        return $user;
    }
}
