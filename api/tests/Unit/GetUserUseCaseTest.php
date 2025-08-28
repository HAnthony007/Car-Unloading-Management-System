<?php

use App\Application\User\UseCases\GetUserUseCase;
use App\Domain\Auth\ValueObjects\Email;
use App\Domain\Role\ValueObjects\RoleId;
use App\Domain\User\Entities\User;
use App\Domain\User\Repositories\UserRepositoryInterface;
use App\Domain\User\ValueObjects\MatriculationNumber;
use App\Domain\User\ValueObjects\UserId;
use Illuminate\Foundation\Testing\RefreshDatabase;

// Simple fake repository (no external mocking)
class FakeUserRepository_ForGet implements UserRepositoryInterface
{
    public ?User $found = null;

    public function findById(UserId $userId): ?User
    {
        return $this->found;
    }

    public function findByMatriculationNumber(\App\Domain\User\ValueObjects\MatriculationNumber $matriculationNumber): ?User
    {
        return null;
    }

    public function findByEmail(\App\Domain\Auth\ValueObjects\Email $email): ?User
    {
        return null;
    }

    public function findByRole(\App\Domain\Role\ValueObjects\RoleId $roleId): array
    {
        return [];
    }

    public function findAll(): array
    {
        return [];
    }

    public function save(User $user): User
    {
        return $user;
    }

    public function delete(UserId $userId): bool
    {
        return true;
    }

    public function exists(\App\Domain\Auth\ValueObjects\Email $email): bool
    {
        return false;
    }

    public function matriculationExists(\App\Domain\User\ValueObjects\MatriculationNumber $matriculationNumber): bool
    {
        return false;
    }

    public function getActiveUsers(): array
    {
        return [];
    }

    public function getUsersWithUnverifiedEmail(): array
    {
        return [];
    }
}

uses(RefreshDatabase::class);

describe('GetUserUseCase', function () {

    it('returns user when found', function () {
        // Arrange
        $userId = 1;
        $user = new User(
            userId: new UserId($userId),
            matriculationNumber: new MatriculationNumber('USER001'),
            fullName: 'John Doe',
            email: new Email('john@example.com'),
            hashedPassword: 'hashed_password',
            avatar: null,
            phoneNumber: null,
            roleId: new RoleId(1),
            emailVerifiedAt: now(),
            rememberToken: null,
            createdAt: now()
        );

        $userRepository = new FakeUserRepository_ForGet;
        $userRepository->found = $user;
        $getUserUseCase = new GetUserUseCase($userRepository);

        // Act
        $result = $getUserUseCase->execute($userId);

        // Assert
        expect($result)->toBeInstanceOf(User::class);
        expect($result->getUserId()->getValue())->toBe($userId);
    });

    it('throws exception when user not found', function () {
        // Arrange
        $userId = 999;

        $userRepository = new FakeUserRepository_ForGet;
        $getUserUseCase = new GetUserUseCase($userRepository);
        $userRepository->found = null;

        // Act & Assert
        expect(function () use ($getUserUseCase, $userId) {
            $getUserUseCase->execute($userId);
        })->toThrow(Exception::class, 'User not found.');
    });

    // Helper function moved to a trait or shared helper
});
