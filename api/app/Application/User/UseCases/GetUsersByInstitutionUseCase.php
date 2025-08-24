<?php

namespace App\Application\User\UseCases;

use App\Domain\User\Repositories\UserRepositoryInterface;

final class GetUsersByInstitutionUseCase
{
    public function __construct(
        private readonly UserRepositoryInterface $userRepository,
    ) {}
        
    public function execute(string $institutionPrefix): array
    {
        $allUsers = $this->userRepository->findAll();

        return array_filter($allUsers, function($user) use ($institutionPrefix) {
            return $user->getMatriculationNumber()->getPrefix() === strtoupper($institutionPrefix);
        });
    }
}