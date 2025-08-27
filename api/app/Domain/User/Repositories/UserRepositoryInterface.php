<?php

namespace App\Domain\User\Repositories;

use App\Domain\Auth\ValueObjects\Email;
use App\Domain\Role\ValueObjects\RoleId;
use App\Domain\User\Entities\User;
use App\Domain\User\ValueObjects\MatriculationNumber;
use App\Domain\User\ValueObjects\UserId;

interface UserRepositoryInterface
{
    public function findById(UserId $userId): ?User;

    public function findByMatriculationNumber(MatriculationNumber $matriculationNumber): ?User;

    public function findByEmail(Email $email): ?User;

    public function findByRole(RoleId $roleId): array;

    public function findAll(): array;

    public function save(User $user): User;

    public function delete(UserId $userId): bool;

    public function exists(Email $email): bool;

    public function matriculationExists(MatriculationNumber $matriculationNumber): bool;

    public function getActiveUsers(): array;

    public function getUsersWithUnverifiedEmail(): array;

    // public function update(User $user): User;
}
