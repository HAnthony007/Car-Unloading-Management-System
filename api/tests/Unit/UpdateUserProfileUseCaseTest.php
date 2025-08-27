<?php

use App\Application\User\DTOs\UpdateUsersProfileDTO;
use App\Application\User\UseCases\UpdateUserProfileUseCase;
use App\Domain\Auth\ValueObjects\Email;
use App\Domain\Role\ValueObjects\RoleId;
use App\Domain\User\Entities\User;
use App\Domain\User\Repositories\UserRepositoryInterface;
use App\Domain\User\ValueObjects\MatriculationNumber;
use App\Domain\User\ValueObjects\PhoneNumber;
use App\Domain\User\ValueObjects\UserId;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

describe('UpdateUserProfileUseCase', function () {
    class FakeUserRepository_ForUpdate implements UserRepositoryInterface
    {
        public ?User $found = null;

        public ?User $saved = null;

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
            $this->saved = $user;

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

    it('updates user profile successfully', function () {
        // Arrange
        $userId = 1;
        $dto = new UpdateUsersProfileDTO(
            userId: $userId,
            fullName: 'Updated Name',
            phone: '+1234567890',
            avatar: '/avatars/updated.jpg'
        );

        $existingUser = new User(
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

        $updatedUser = new User(
            userId: new UserId($userId),
            matriculationNumber: new MatriculationNumber('USER001'),
            fullName: 'Updated Name',
            email: new Email('john@example.com'),
            hashedPassword: 'hashed_password',
            avatar: '/avatars/updated.jpg',
            phoneNumber: new PhoneNumber('+1234567890'),
            roleId: new RoleId(1),
            emailVerifiedAt: now(),
            rememberToken: null,
            createdAt: now()
        );

        $repo = new FakeUserRepository_ForUpdate;
        $repo->found = $existingUser;
        $useCase = new UpdateUserProfileUseCase($repo);

        // Act
        $result = $useCase->execute($dto);

        // Assert
        expect($result)->toBeInstanceOf(User::class);
    });

    it('throws exception when user not found', function () {
        // Arrange
        $userId = 999;
        $dto = new UpdateUsersProfileDTO(
            userId: $userId,
            fullName: 'Updated Name'
        );

        $repo = new FakeUserRepository_ForUpdate;
        $repo->found = null;
        $useCase = new UpdateUserProfileUseCase($repo);

        // Act & Assert
        expect(fn () => $useCase->execute($dto))->toThrow(Exception::class, 'User not found.');
    });

    it('updates only provided fields', function () {
        // Arrange
        $userId = 1;
        $dto = new UpdateUsersProfileDTO(
            userId: $userId,
            fullName: 'New Name Only'
        );

        $existingUser = new User(
            userId: new UserId($userId),
            matriculationNumber: new MatriculationNumber('USER001'),
            fullName: 'Original Name',
            email: new Email('john@example.com'),
            hashedPassword: 'hashed_password',
            avatar: null,
            phoneNumber: new PhoneNumber('+0987654321'),
            roleId: new RoleId(1),
            emailVerifiedAt: now(),
            rememberToken: null,
            createdAt: now()
        );

        $updatedUser = new User(
            userId: new UserId($userId),
            matriculationNumber: new MatriculationNumber('USER001'),
            fullName: 'New Name Only',
            email: new Email('john@example.com'),
            hashedPassword: 'hashed_password',
            avatar: null,
            phoneNumber: new PhoneNumber('+0987654321'),
            roleId: new RoleId(1),
            emailVerifiedAt: now(),
            rememberToken: null,
            createdAt: now()
        );

        $repo = new FakeUserRepository_ForUpdate;
        $repo->found = $existingUser;
        $useCase = new UpdateUserProfileUseCase($repo);

        // Act
        $result = $useCase->execute($dto);

        // Assert
        expect($result)->toBeInstanceOf(User::class);
    });
});
