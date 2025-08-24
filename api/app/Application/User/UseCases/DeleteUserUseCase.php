<?php

namespace App\Application\User\UseCases;

use App\Domain\User\Repositories\UserRepositoryInterface;
use App\Domain\User\ValueObjects\UserId;

final class DeleteUserUseCase
{
    public function __construct(
        private readonly UserRepositoryInterface $userRepository,
    ) {}

    public function execute(int $userId): bool
    {
        $user = $this->userRepository->findById(new UserId($userId));

        if (!$user) {
            throw new \Exception('User not found.');
        }

        return $this->userRepository->delete(new UserId($userId));
    }
}
