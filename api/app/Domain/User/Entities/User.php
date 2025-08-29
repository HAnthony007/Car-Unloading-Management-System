<?php

namespace App\Domain\User\Entities;

use App\Domain\Auth\ValueObjects\Email;
use App\Domain\Role\Entities\Role as RoleEntity;
use App\Domain\Role\ValueObjects\RoleId;
use App\Domain\User\ValueObjects\MatriculationNumber;
use App\Domain\User\ValueObjects\PhoneNumber;
use App\Domain\User\ValueObjects\UserId;
use Carbon\Carbon;

final class User
{
    public function __construct(
        private readonly ?UserId $userId,
        private readonly MatriculationNumber $matriculationNumber,
        private readonly string $fullName,
        private readonly Email $email,
        private readonly string $hashedPassword,
        private ?string $avatar,
        private readonly ?PhoneNumber $phoneNumber,
        private readonly RoleId $roleId,
        private readonly ?Carbon $emailVerifiedAt,
        private readonly ?string $rememberToken,
        private ?Carbon $lastLoginAt = null,
        private readonly ?Carbon $createdAt = null,
        private readonly ?Carbon $updatedAt = null,
        private readonly ?RoleEntity $role = null
    ) {}

    public function getUserId(): ?UserId
    {
        return $this->userId;
    }

    public function getMatriculationNumber(): MatriculationNumber
    {
        return $this->matriculationNumber;
    }

    public function getFullName(): string
    {
        return $this->fullName;
    }

    public function getFirstName(): string
    {
        return explode(' ', $this->fullName)[0];
    }

    public function getLastName(): string
    {
        $parts = explode(' ', $this->fullName);

        return count($parts) > 1 ? end($parts) : '';
    }

    public function getEmail(): Email
    {
        return $this->email;
    }

    public function getHashedPassword(): string
    {
        return $this->hashedPassword;
    }

    public function getAvatar(): ?string
    {
        return $this->avatar;
    }

    public function setAvatar(?string $avatar): void
    {
        $this->avatar = $avatar;
    }

    public function getPhoneNumber(): ?PhoneNumber
    {
        return $this->phoneNumber;
    }

    public function getRoleId(): RoleId
    {
        return $this->roleId;
    }

    public function getRole(): ?RoleEntity
    {
        return $this->role;
    }

    public function getEmailVerifiedAt(): ?Carbon
    {
        return $this->emailVerifiedAt;
    }

    public function getRememberToken(): ?string
    {
        return $this->rememberToken;
    }

    public function getLastLoginAt(): ?Carbon
    {
        return $this->lastLoginAt;
    }

    public function getCreatedAt(): ?Carbon
    {
        return $this->createdAt;
    }

    public function getUpdatedAt(): ?Carbon
    {
        return $this->updatedAt;
    }

    public function isEmailVerified(): bool
    {
        return $this->emailVerifiedAt !== null;
    }

    public function isActive(): bool
    {
        return $this->isEmailVerified() && ($this->lastLoginAt !== null && $this->lastLoginAt->diffInDays(now()) <= 90);
    }

    public function hasAvatar(): bool
    {
        return ! empty($this->avatar);
    }

    public function hasPhoneNumber(): bool
    {
        return $this->phoneNumber !== null && $this->phoneNumber->hasValue();
    }

    public function updateLastLoginAt(Carbon $loginTime): self
    {
        $this->lastLoginAt = $loginTime;

        return $this;
    }

    public function canResetPassword(): bool
    {
        return $this->isEmailVerified();
    }

    public function getDisplayName(): string
    {
        return $this->fullName ?: $this->email->getValue();
    }

    public function isFromSameInstitution(User $other): bool
    {
        return $this->matriculationNumber->getPrefix() === $other->matriculationNumber->getPrefix();
    }

    public function getAvatarUrl(): ?string
    {
        if (! $this->hasAvatar()) {
            return null;
        }

        if (str_starts_with($this->avatar, 'http')) {
            return $this->avatar;
        }

        // Use configured app URL to build a stable absolute URL during tests
        $baseUrl = rtrim(config('app.url', 'http://localhost'), '/');
        // Normalize avatar path to avoid double 'avatars' when avatar already contains the folder
        $normalized = ltrim($this->avatar, '/');

        if (str_starts_with($normalized, 'avatars/')) {
            $avatarPath = 'storage/'.$normalized;
        } else {
            $avatarPath = 'storage/avatars/'.$normalized;
        }

        return $baseUrl.'/'.ltrim($avatarPath, '/');
    }
}
