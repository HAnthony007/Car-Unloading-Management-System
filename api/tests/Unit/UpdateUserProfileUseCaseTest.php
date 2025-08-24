<?php

use App\Application\User\DTOs\UpdateUsersProfileDTO;
use App\Application\User\UseCases\UpdateUserProfileUseCase;
use App\Domain\User\Entities\User;
use App\Domain\User\Repositories\UserRepositoryInterface;
use App\Domain\User\ValueObjects\UserId;
use App\Domain\User\ValueObjects\MatriculationNumber;
use App\Domain\Auth\ValueObjects\Email;
use App\Domain\Role\ValueObjects\RoleId;
use App\Domain\User\ValueObjects\PhoneNumber;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Mockery;

uses(RefreshDatabase::class);

describe('UpdateUserProfileUseCase', function () {
    
    beforeEach(function () {
        $this->userRepository = Mockery::mock(UserRepositoryInterface::class);
        $this->updateUserProfileUseCase = new UpdateUserProfileUseCase($this->userRepository);
    });

    afterEach(function () {
        Mockery::close();
    });

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

        $this->userRepository
            ->shouldReceive('findById')
            ->with(Mockery::type(UserId::class))
            ->andReturn($existingUser);

        $this->userRepository
            ->shouldReceive('save')
            ->with(Mockery::type(User::class))
            ->andReturn($updatedUser);

        // Act
        $result = $this->updateUserProfileUseCase->execute($dto);

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

        $this->userRepository
            ->shouldReceive('findById')
            ->with(Mockery::type(UserId::class))
            ->andReturn(null);

        // Act & Assert
        expect(function () use ($dto) {
            $this->updateUserProfileUseCase->execute($dto);
        })->toThrow(Exception::class, 'User not found.');
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

        $this->userRepository
            ->shouldReceive('findById')
            ->with(Mockery::type(UserId::class))
            ->andReturn($existingUser);

        $this->userRepository
            ->shouldReceive('save')
            ->with(Mockery::type(User::class))
            ->andReturn($updatedUser);

        // Act
        $result = $this->updateUserProfileUseCase->execute($dto);

        // Assert
        expect($result)->toBeInstanceOf(User::class);
    });
});
