<?php

use App\Application\User\UseCases\DeleteUserUseCase;
use App\Domain\Auth\ValueObjects\Email;
use App\Domain\Role\ValueObjects\RoleId;
use App\Domain\User\Entities\User;
use App\Domain\User\Repositories\UserRepositoryInterface;
use App\Domain\User\ValueObjects\MatriculationNumber;
use App\Domain\User\ValueObjects\UserId;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

describe('DeleteUserUseCase', function () {
    class FakeUserRepository_ForDelete implements UserRepositoryInterface
    {
        public ?User $found = null;

        public bool $deleted = false;

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
            $this->deleted = true;

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

    it('deletes user successfully when user exists', function () {
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

        $userRepository = new FakeUserRepository_ForDelete;
        $userRepository->found = $user;
        $deleteUserUseCase = new DeleteUserUseCase($userRepository);

        // Act
        $result = $deleteUserUseCase->execute($userId);

        // Assert
        expect($result)->toBe(true);
    });

    it('throws exception when user not found', function () {
        // Arrange
        $userId = 999;

        $userRepository = new FakeUserRepository_ForDelete;
        $userRepository->found = null;
        $deleteUserUseCase = new DeleteUserUseCase($userRepository);

        // Act & Assert
        expect(function () use ($deleteUserUseCase, $userId) {
            $deleteUserUseCase->execute($userId);
        })->toThrow(Exception::class, 'User not found.');
    });
});
