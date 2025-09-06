<?php

namespace App\Application\User\UseCases;

use App\Application\User\DTOs\CreateUserDTO;
use App\Domain\Role\Repositories\RoleRepositoryInterface;
use App\Domain\Role\ValueObjects\RoleId;
use App\Domain\User\Entities\User;
use App\Domain\User\Repositories\UserRepositoryInterface;
use App\Domain\User\Services\MatriculationNumberGeneratorService;
use Illuminate\Support\Facades\Hash;

final class CreateUserUseCase
{
    public function __construct(
        private readonly UserRepositoryInterface $userRepository,
        private readonly RoleRepositoryInterface $roleRepository, private readonly MatriculationNumberGeneratorService $matriculationGenerator
    ) {}

    public function execute(CreateUserDTO $dto): User
    {
        $role = $this->roleRepository->findById(new RoleId($dto->roleId));
        if (! $role) {
            // TODO Create RoleNotFoundException
            throw new \RuntimeException('Invalid role');
        }

        if ($this->userRepository->exists($dto->getEmailAsV0())) {
            // TODO Create UserAlreadyExistsException
            throw new \RuntimeException("User with email {$dto->email} already exists");
        }

        // Determine matriculation number: use provided if valid, otherwise generate based on role
        $provided = $dto->matriculationNumber ?? '';
        $matriculation = null;
        if (! empty($provided) && $this->matriculationGenerator->isValidFormat($provided)) {
            $matriculation = $dto->getMatriculationNumberAsV0();
        } else {
            // Build prefix from role: use ADM for admins, otherwise role name uppercase first 3 chars
            $roleName = $role->getRoleName();
            $prefix = $role->isAdministrator() ? 'ADM' : strtoupper(substr($roleName, 0, 3));
            $matriculation = $this->matriculationGenerator->generateNext($prefix);
        }

        $user = new User(
            userId: null,
            matriculationNumber: $matriculation,
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
