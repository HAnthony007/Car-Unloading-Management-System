<?php

namespace App\Application\User\UseCases;

use App\Application\User\DTOs\UpdateUsersProfileDTO;
use App\Domain\Role\Repositories\RoleRepositoryInterface;
use App\Domain\Role\ValueObjects\RoleId as DomainRoleId;
use App\Domain\User\Entities\User;
use App\Domain\User\Repositories\UserRepositoryInterface;
use App\Domain\User\ValueObjects\UserId;

final class UpdateUserProfileUseCase
{
    public function __construct(
        private readonly UserRepositoryInterface $userRepository,
        private readonly ?RoleRepositoryInterface $roleRepository = null,
    ) {}

    public function execute(UpdateUsersProfileDTO $dto): User
    {
        $user = $this->userRepository->findById(new UserId($dto->userId));

        if (! $user) {
            throw new \Exception('User not found.');
        }

        $roleId = $user->getRoleId();
        if ($dto->roleId !== null) {
            if ($this->roleRepository === null) {
                throw new \RuntimeException('Role repository is required to update role.');
            }
            // Validate role exists
            $role = $this->roleRepository->findById(new DomainRoleId($dto->roleId));
            if (! $role) {
                throw new \Exception('Role not found.');
            }
            $roleId = new DomainRoleId($dto->roleId);
        }

        $updatedUser = new User(
            userId: $user->getUserId(),
            matriculationNumber: $user->getMatriculationNumber(),
            fullName: $dto->fullName ?? $user->getFullName(),
            email: $user->getEmail(),
            hashedPassword: $user->getHashedPassword(),
            avatar: $dto->avatar ?? $user->getAvatar(),
            phoneNumber: $dto->getPhoneAsV0() ?? $user->getPhoneNumber(),
            roleId: $roleId,
            emailVerifiedAt: $user->getEmailVerifiedAt(),
            rememberToken: $user->getRememberToken(),
            lastLoginAt: $user->getLastLoginAt(),
            createdAt: $user->getCreatedAt(),
            updatedAt: now(),
        );

        return $this->userRepository->save($updatedUser);
    }
}
