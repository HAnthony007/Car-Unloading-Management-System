<?php

namespace App\Application\User\UseCases;

use App\Domain\User\Entities\User;
use App\Domain\User\Repositories\UserRepositoryInterface;
use App\Domain\User\ValueObjects\MatriculationNumber;

final class GetUserByMatriculationUseCase
{
    public function __construct(
        private readonly UserRepositoryInterface $userRepository,
    ) {}

    public function execute(string $matriculationNumber): ?User
    {
        $matNumber = new MatriculationNumber($matriculationNumber);

        $user = $this->userRepository->findByMatriculationNumber($matNumber);

        if (! $user) {
            throw new \Exception('User not found.');
        }

        return $user;
    }
}
