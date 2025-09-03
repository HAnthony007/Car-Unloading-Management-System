<?php

namespace App\Application\User\DTOs;

use App\Domain\User\ValueObjects\PhoneNumber;

final class UpdateUsersProfileDTO
{
    public function __construct(
        public readonly int $userId,
        public readonly ?string $fullName = null,
    public readonly ?string $email = null,
        public readonly ?string $avatar = null,
        public readonly ?string $phone = null,
        public readonly ?int $roleId = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            userId: (int) $data['user_id'],
            fullName: $data['full_name'] ?? null,
            email: $data['email'] ?? null,
            avatar: $data['avatar'] ?? null,
            phone: $data['phone'] ?? null,
            roleId: isset($data['role_id']) ? (int) $data['role_id'] : null,
        );
    }

    public function getPhoneAsV0(): ?PhoneNumber
    {
        return $this->phone ? new PhoneNumber($this->phone) : null;
    }
}
