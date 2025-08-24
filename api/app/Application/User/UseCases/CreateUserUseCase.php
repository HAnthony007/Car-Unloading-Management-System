<?php

namespace App\Application\User\UseCases;

use App\Application\User\DTOs\CreateUserDTO;
use App\Domain\Role\Entities\Role;
use App\Domain\Role\Repositories\RoleRepositoryInterface;
use App\Domain\Role\ValueObjects\RoleId;
use App\Domain\User\Entities\User;
use App\Domain\User\Repositories\UserRepositoryInterface;
use Illuminate\Support\Facades\Hash;

final class CreateUserUseCase
{
    public function __construct(
        private readonly UserRepositoryInterface $userRepository,
        private readonly RoleRepositoryInterface $roleRepository
    ) {}

    public function execute(CreateUserDTO $dto): User
    {
        $role = $this->roleRepository->findById(new RoleId($dto->roleId));
        if (!$role) {
            // TODO Create RoleNotFoundException
            throw new \RuntimeException('Invalid role');
        }

        if ($this->userRepository->exists($dto->getEmailAsV0())) {
            // TODO Create UserAlreadyExistsException
            throw new \RuntimeException("User with email {$dto->email} already exists");
        }
    
        $user = new User(
            userId: null,
            matriculationNumber: $dto->getMatriculationNumberAsV0(),
            fullName: $dto->fullName,
            email: $dto->getEmailAsV0(),
            hashedPassword: Hash::make($dto->password),
            avatar: $dto->avatar,
            phoneNumber: $dto->getPhoneAsV0(),
            roleId: $role->getRoleId(),
            emailVerifiedAt: null,
            rememberToken: null,
        );

        return $this->userRepository->save($user);
    }

}