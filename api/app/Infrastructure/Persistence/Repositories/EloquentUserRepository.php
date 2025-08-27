<?php

namespace App\Infrastructure\Persistence\Repositories;

use App\Domain\Auth\ValueObjects\Email;
use App\Domain\Role\ValueObjects\RoleId;
use App\Domain\User\Entities\User as DomainUser;
use App\Domain\User\Repositories\UserRepositoryInterface;
use App\Domain\User\ValueObjects\MatriculationNumber;
use App\Domain\User\ValueObjects\PhoneNumber;
use App\Domain\User\ValueObjects\UserId;
use App\Models\User as EloquentUser;

final class EloquentUserRepository implements UserRepositoryInterface
{
    public function findById(UserId $userId): ?DomainUser
    {
        $eloquentUser = EloquentUser::with('role')
            ->where('user_id', $userId->getValue())
            ->first();

        return $eloquentUser ? $this->toDomainEntity($eloquentUser) : null;
    }

    public function findByMatriculationNumber(MatriculationNumber $matriculationNumber): ?DomainUser
    {
        $eloquentUser = EloquentUser::with('role')
            ->where('matriculation_no', $matriculationNumber->getValue())
            ->first();

        return $eloquentUser ? $this->toDomainEntity($eloquentUser) : null;
    }

    public function findByEmail(Email $email): ?DomainUser
    {
        $eloquentUser = EloquentUser::with('role')
            ->where('email', $email->getValue())
            ->first();

        return $eloquentUser ? $this->toDomainEntity($eloquentUser) : null;
    }

    public function findByRole(RoleId $roleId): array
    {
        return EloquentUser::with('role')
            ->where('role_id', $roleId->getValue())
            ->get()
            ->map(fn ($user) => $this->toDomainEntity($user))
            ->toArray();
    }

    public function findAll(): array
    {
        return EloquentUser::with('role')
            ->get()
            ->map(fn ($user) => $this->toDomainEntity($user))
            ->toArray();
    }

    public function save(DomainUser $user): DomainUser
    {
        $data = [
            'matriculation_no' => $user->getMatriculationNumber()->getValue(),
            'full_name' => $user->getFullName(),
            'email' => $user->getEmail()->getValue(),
            'password' => $user->getHashedPassword(),
            'avatar' => $user->getAvatar(),
            'phone' => $user->getPhoneNumber()?->getValue(),
            'role_id' => $user->getRoleId()->getValue(),
            'email_verified_at' => $user->getEmailVerifiedAt(),
            'remember_token' => $user->getRememberToken(),
        ];

        if ($user->getUserId()) {
            $eloquentUser = EloquentUser::findOrFail($user->getUserId()->getValue());
            $eloquentUser->update($data);
        } else {
            $eloquentUser = EloquentUser::create($data);
        }

        return $this->toDomainEntity($eloquentUser->load('role'));
    }

    public function delete(UserId $userId): bool
    {
        return EloquentUser::destroy($userId->getValue()) > 0;
    }

    public function exists(Email $email): bool
    {
        return EloquentUser::where('email', $email->getValue())->exists();
    }

    public function matriculationExists(MatriculationNumber $matriculationNumber): bool
    {
        return EloquentUser::where('matriculation_no', $matriculationNumber->getValue())->exists();
    }

    public function getActiveUsers(): array
    {
        return EloquentUser::with('role')
            ->whereNotNull('email_verified_at')
            ->where('created_at', '>', now()->subDays(90))
            ->get()
            ->map(fn ($user) => $this->toDomainEntity($user))
            ->toArray();
    }

    public function getUsersWithUnverifiedEmail(): array
    {
        return EloquentUser::with('role')
            ->whereNull('email_verified_at')
            ->get()
            ->map(fn ($user) => $this->toDomainEntity($user))
            ->toArray();
    }

    private function toDomainEntity(EloquentUser $eloquentUser): DomainUser
    {
        $roleDomain = null;

        if ($eloquentUser->relationLoaded('role') && $eloquentUser->role) {
            $eloquentRole = $eloquentUser->role;
            $roleDomain = new \App\Domain\Role\Entities\Role(
                new \App\Domain\Role\ValueObjects\RoleId($eloquentRole->role_id),
                $eloquentRole->role_name,
                $eloquentRole->role_description,
                $eloquentRole->created_at ?? null,
                $eloquentRole->updated_at ?? null,
            );
        }

        return new DomainUser(
            userId: new UserId($eloquentUser->user_id),
            matriculationNumber: new MatriculationNumber($eloquentUser->matriculation_no),
            fullName: $eloquentUser->full_name,
            email: new Email($eloquentUser->email),
            hashedPassword: $eloquentUser->password,
            avatar: $eloquentUser->avatar,
            phoneNumber: $eloquentUser->phone ? new PhoneNumber($eloquentUser->phone) : null,
            roleId: new RoleId($eloquentUser->role_id),
            emailVerifiedAt: $eloquentUser->email_verified_at,
            rememberToken: $eloquentUser->remember_token,
            createdAt: $eloquentUser->created_at,
            updatedAt: $eloquentUser->updated_at,
            role: $roleDomain,
        );
    }
}
