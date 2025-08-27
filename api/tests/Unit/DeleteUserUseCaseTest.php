<?php

use App\Application\User\UseCases\DeleteUserUseCase;
use App\Domain\Auth\ValueObjects\Email;
use App\Domain\Role\ValueObjects\RoleId;
use App\Domain\User\Entities\User;
use App\Domain\User\Repositories\UserRepositoryInterface;
use App\Domain\User\ValueObjects\MatriculationNumber;
use App\Domain\User\ValueObjects\UserId;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Mockery;

uses(RefreshDatabase::class);

describe('DeleteUserUseCase', function () {

    beforeEach(function () {
        $this->userRepository = Mockery::mock(UserRepositoryInterface::class);
        $this->deleteUserUseCase = new DeleteUserUseCase($this->userRepository);
    });

    afterEach(function () {
        Mockery::close();
    });

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

        $this->userRepository
            ->shouldReceive('findById')
            ->with(Mockery::type(UserId::class))
            ->andReturn($user);

        $this->userRepository
            ->shouldReceive('delete')
            ->with(Mockery::type(UserId::class))
            ->andReturn(true);

        // Act
        $result = $this->deleteUserUseCase->execute($userId);

        // Assert
        expect($result)->toBe(true);
    });

    it('throws exception when user not found', function () {
        // Arrange
        $userId = 999;

        $this->userRepository
            ->shouldReceive('findById')
            ->with(Mockery::type(UserId::class))
            ->andReturn(null);

        // Act & Assert
        expect(function () use ($userId) {
            $this->deleteUserUseCase->execute($userId);
        })->toThrow(Exception::class, 'User not found.');
    });
});
