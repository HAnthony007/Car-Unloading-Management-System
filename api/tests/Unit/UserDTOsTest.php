<?php

use App\Application\User\DTOs\CreateUserDTO;
use App\Application\User\DTOs\UpdateUsersProfileDTO;
use App\Application\User\DTOs\UserSearchCriteriaDTO;
use App\Domain\Auth\ValueObjects\Email;
use App\Domain\User\ValueObjects\MatriculationNumber;
use App\Domain\User\ValueObjects\PhoneNumber;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

uses(RefreshDatabase::class);

describe('User DTOs', function () {
    
    describe('CreateUserDTO', function () {
        it('creates DTO with correct values', function () {
            $dto = new CreateUserDTO(
                matriculationNumber: 'USER001',
                fullName: 'John Doe',
                email: new Email('john@example.com'),
                password: 'password123',
                avatar: '/avatars/john.jpg',
                phone: '+1234567890',
                roleId: 1
            );

            expect($dto->matriculationNumber)->toBe('USER001');
            expect($dto->fullName)->toBe('John Doe');
            expect($dto->email->getValue())->toBe('john@example.com');
            expect($dto->password)->toBe('password123');
            expect($dto->avatar)->toBe('/avatars/john.jpg');
            expect($dto->phone)->toBe('+1234567890');
            expect($dto->roleId)->toBe(1);
        });

        it('creates DTO from array', function () {
            $data = [
                'matriculation_no' => 'USER001',
                'full_name' => 'John Doe',
                'email' => 'john@example.com',
                'password' => 'password123',
                'avatar' => '/avatars/john.jpg',
                'phone' => '+1234567890',
                'role_id' => 1
            ];

            $dto = CreateUserDTO::fromArray($data);

            expect($dto->matriculationNumber)->toBe('USER001');
            expect($dto->fullName)->toBe('John Doe');
            expect($dto->email->getValue())->toBe('john@example.com');
            expect($dto->password)->toBe('password123');
            expect($dto->avatar)->toBe('/avatars/john.jpg');
            expect($dto->phone)->toBe('+1234567890');
            expect($dto->roleId)->toBe(1);
        });

        it('handles missing optional fields', function () {
            $data = [
                'matriculation_no' => 'USER001',
                'full_name' => 'John Doe',
                'email' => 'john@example.com',
                'password' => 'password123',
                'role_id' => 1
            ];

            $dto = CreateUserDTO::fromArray($data);

            expect($dto->avatar)->toBe('');
            expect($dto->phone)->toBe('');
        });

        it('converts to array correctly', function () {
            $dto = new CreateUserDTO(
                matriculationNumber: 'USER001',
                fullName: 'John Doe',
                email: new Email('john@example.com'),
                password: 'password123',
                avatar: '/avatars/john.jpg',
                phone: '+1234567890',
                roleId: 1
            );

            $array = $dto->toArray();

            expect($array)->toHaveKey('matriculation_number');
            expect($array)->toHaveKey('full_name');
            expect($array)->toHaveKey('email');
            expect($array)->toHaveKey('password');
            expect($array)->toHaveKey('avatar');
            expect($array)->toHaveKey('phone');
            expect($array)->toHaveKey('role_id');
            expect($array['password'])->toBe('[PROTECTED]');
        });

        it('creates value objects correctly', function () {
            $dto = new CreateUserDTO(
                matriculationNumber: 'USER001',
                fullName: 'John Doe',
                email: new Email('john@example.com'),
                password: 'password123',
                avatar: null,
                phone: '+1234567890',
                roleId: 1
            );

            $matriculationV0 = $dto->getMatriculationNumberAsV0();
            $emailV0 = $dto->getEmailAsV0();
            $phoneV0 = $dto->getPhoneAsV0();

            expect($matriculationV0)->toBeInstanceOf(MatriculationNumber::class);
            expect($emailV0)->toBeInstanceOf(Email::class);
            expect($phoneV0)->toBeInstanceOf(PhoneNumber::class);
            expect($matriculationV0->getValue())->toBe('USER001');
            expect($emailV0->getValue())->toBe('john@example.com');
            expect($phoneV0->getValue())->toBe('+1234567890');
        });

        it('handles null phone correctly', function () {
            $dto = new CreateUserDTO(
                matriculationNumber: 'USER001',
                fullName: 'John Doe',
                email: new Email('john@example.com'),
                password: 'password123',
                avatar: null,
                phone: null,
                roleId: 1
            );

            $phoneV0 = $dto->getPhoneAsV0();

            expect($phoneV0)->toBeNull();
        });
    });

    describe('UpdateUsersProfileDTO', function () {
        it('creates DTO with correct values', function () {
            $dto = new UpdateUsersProfileDTO(
                userId: 1,
                fullName: 'John Doe Updated',
                avatar: '/avatars/updated.jpg',
                phone: '+1234567890'
            );

            expect($dto->userId)->toBe(1);
            expect($dto->fullName)->toBe('John Doe Updated');
            expect($dto->avatar)->toBe('/avatars/updated.jpg');
            expect($dto->phone)->toBe('+1234567890');
        });

        it('creates DTO from array', function () {
            $data = [
                'user_id' => 1,
                'full_name' => 'John Doe Updated',
                'avatar' => '/avatars/updated.jpg',
                'phone' => '+1234567890'
            ];

            $dto = UpdateUsersProfileDTO::fromArray($data);

            expect($dto->userId)->toBe(1);
            expect($dto->fullName)->toBe('John Doe Updated');
            expect($dto->avatar)->toBe('/avatars/updated.jpg');
            expect($dto->phone)->toBe('+1234567890');
        });

        it('handles missing optional fields', function () {
            $data = [
                'user_id' => 1,
                'full_name' => 'John Doe Updated'
            ];

            $dto = UpdateUsersProfileDTO::fromArray($data);

            expect($dto->avatar)->toBeNull();
            expect($dto->phone)->toBeNull();
        });

        it('creates phone value object correctly', function () {
            $dto = new UpdateUsersProfileDTO(
                userId: 1,
                phone: '+1234567890'
            );

            $phoneV0 = $dto->getPhoneAsV0();

            expect($phoneV0)->toBeInstanceOf(PhoneNumber::class);
            expect($phoneV0->getValue())->toBe('+1234567890');
        });

        it('handles null phone correctly', function () {
            $dto = new UpdateUsersProfileDTO(
                userId: 1
            );

            $phoneV0 = $dto->getPhoneAsV0();

            expect($phoneV0)->toBeNull();
        });
    });

    describe('UserSearchCriteriaDTO', function () {
        it('creates DTO with default values', function () {
            $dto = new UserSearchCriteriaDTO();

            expect($dto->matriculationPrefix)->toBeNull();
            expect($dto->roleId)->toBeNull();
            expect($dto->emailVerified)->toBeNull();
            expect($dto->isActive)->toBeNull();
            expect($dto->searchTerm)->toBeNull();
            expect($dto->page)->toBe(1);
            expect($dto->perPage)->toBe(15);
        });

        it('creates DTO with custom values', function () {
            $dto = new UserSearchCriteriaDTO(
                matriculationPrefix: 'USER',
                roleId: 1,
                emailVerified: true,
                isActive: true,
                searchTerm: 'john',
                page: 2,
                perPage: 20
            );

            expect($dto->matriculationPrefix)->toBe('USER');
            expect($dto->roleId)->toBe(1);
            expect($dto->emailVerified)->toBe(true);
            expect($dto->isActive)->toBe(true);
            expect($dto->searchTerm)->toBe('john');
            expect($dto->page)->toBe(2);
            expect($dto->perPage)->toBe(20);
        });

        it('creates DTO from array', function () {
            $data = [
                'matriculation_prefix' => 'USER',
                'role_id' => 1,
                'email_verified' => true,
                'is_active' => true,
                'search_term' => 'john',
                'page' => 2,
                'per_page' => 20
            ];

            $dto = UserSearchCriteriaDTO::fromArray($data);

            expect($dto->matriculationPrefix)->toBe('USER');
            expect($dto->roleId)->toBe(1);
            expect($dto->emailVerified)->toBe(true);
            expect($dto->isActive)->toBe(true);
            expect($dto->searchTerm)->toBe('john');
            expect($dto->page)->toBe(2);
            expect($dto->perPage)->toBe(20);
        });

        it('handles missing optional fields with defaults', function () {
            $data = [
                'search_term' => 'john'
            ];

            $dto = UserSearchCriteriaDTO::fromArray($data);

            expect($dto->matriculationPrefix)->toBeNull();
            expect($dto->roleId)->toBeNull();
            expect($dto->emailVerified)->toBeNull();
            expect($dto->isActive)->toBeNull();
            expect($dto->searchTerm)->toBe('john');
            expect($dto->page)->toBe(1);
            expect($dto->perPage)->toBe(15);
        });

        it('casts numeric values correctly', function () {
            $data = [
                'role_id' => '1',
                'page' => '2',
                'per_page' => '25'
            ];

            $dto = UserSearchCriteriaDTO::fromArray($data);

            expect($dto->roleId)->toBe(1);
            expect($dto->page)->toBe(2);
            expect($dto->perPage)->toBe(25);
        });

        it('casts boolean values correctly', function () {
            $data = [
                'email_verified' => '1',
                'is_active' => '0'
            ];

            $dto = UserSearchCriteriaDTO::fromArray($data);

            expect($dto->emailVerified)->toBe(true);
            expect($dto->isActive)->toBe(false);
        });
    });
});
