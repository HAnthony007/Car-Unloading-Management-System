<?php

namespace App\Application\User\DTOs;

use App\Domain\User\ValueObjects\PhoneNumber;

final class UpdateUsersProfileDTO
{
    public function __construct(
        public readonly int $userId,
        public readonly ?string $fullName = null,
        public readonly ?string $avatar = null,
        public readonly ?string $phone = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            userId: (int)$data['user_id'],
            fullName: $data['full_name'] ?? null,
            avatar: $data['avatar'] ?? null,
            phone: $data['phone'] ?? null,
        );
    }

    public function getPhoneAsV0(): ?PhoneNumber
    {
        return $this->phone ? new PhoneNumber($this->phone) : null;
    }
}