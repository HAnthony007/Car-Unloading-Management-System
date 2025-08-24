<?php

namespace App\Application\Auth\UseCases;

use App\Application\Auth\DTOs\RegisterDTO;
use App\Domain\Role\ValueObjects\RoleId;
use App\Domain\User\ValueObjects\MatriculationNumber;
use App\Domain\Auth\ValueObjects\Email as EmailVo;
use App\Domain\User\ValueObjects\PhoneNumber;
use App\Domain\User\Entities\User as DomainUser;
use App\Domain\User\Repositories\UserRepositoryInterface;
use App\Domain\Role\Repositories\RoleRepositoryInterface;
use Illuminate\Support\Facades\Hash;
use App\Models\User as EloquentUser;

final class RegisterUseCase
{
    public function __construct(
        private readonly UserRepositoryInterface $userRepository,
        private readonly RoleRepositoryInterface $roleRepository,
    ) {}

    /**
     * Create user (domain), persist and return ['user' => DomainUser, 'token' => string]
     */
    public function execute(RegisterDTO $dto): array
    {
        $role = $this->roleRepository->findById(new RoleId($dto->roleId));
        if (!$role) {
            throw \Illuminate\Validation\ValidationException::withMessages([
                'role_id' => ['Le rôle spécifié n\'existe pas.'],
            ]);
        }

        if ($this->userRepository->exists(new EmailVo($dto->email))) {
            throw \Illuminate\Validation\ValidationException::withMessages([
                'email' => ['Cette adresse email est déjà utilisée.'],
            ]);
        }

        $user = new DomainUser(
            userId: null,
            matriculationNumber: new MatriculationNumber($dto->matriculationNo),
            fullName: $dto->fullName,
            email: new EmailVo($dto->email),
            hashedPassword: Hash::make($dto->password),
            avatar: $dto->avatar,
            phoneNumber: $dto->phone ? new PhoneNumber($dto->phone) : null,
            roleId: $role->getRoleId(),
            emailVerifiedAt: null,
            rememberToken: null,
        );

        $saved = $this->userRepository->save($user);

        // find the eloquent model to create token
        $eloquent = EloquentUser::where('email', $saved->getEmail()->getValue())->first();
        if (!$eloquent) {
            throw new \RuntimeException('Failed to retrieve persisted user.');
        }

        $token = $eloquent->createToken('api-token')->plainTextToken;

        return [
            'user' => $saved,
            'token' => $token,
        ];
    }
}
