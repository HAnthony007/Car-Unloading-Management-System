<?php

use App\Application\User\UseCases\GetUserUseCase;
use App\Domain\User\Entities\User;
use App\Domain\User\Repositories\UserRepositoryInterface;
use App\Domain\User\ValueObjects\UserId;
use App\Domain\User\ValueObjects\MatriculationNumber;
use App\Domain\Auth\ValueObjects\Email;
use App\Domain\Role\ValueObjects\RoleId;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Mockery;

uses(RefreshDatabase::class);

describe('GetUserUseCase', function () {
    
    beforeEach(function () {
        $this->userRepository = Mockery::mock(UserRepositoryInterface::class);
        $this->getUserUseCase = new GetUserUseCase($this->userRepository);
    });

    afterEach(function () {
        Mockery::close();
    });

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

        $this->userRepository
            ->shouldReceive('findById')
            ->with(Mockery::type(UserId::class))
            ->andReturn($user);

        // Act
        $result = $this->getUserUseCase->execute($userId);

        // Assert
        expect($result)->toBeInstanceOf(User::class);
        expect($result->getUserId()->getValue())->toBe((string)$userId);
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
            $this->getUserUseCase->execute($userId);
        })->toThrow(Exception::class, 'User not found.');
    });

    // Helper function moved to a trait or shared helper
});
