<?php

namespace App\Application\User\DTOs;

use App\Domain\Auth\ValueObjects\Email;
use App\Domain\User\ValueObjects\MatriculationNumber;
use App\Domain\User\ValueObjects\PhoneNumber;

final class CreateUserDTO
{
    public function __construct(
        public readonly string $matriculationNumber,
        public readonly string $fullName,
        public readonly Email $email,
        public readonly string $password,
        public readonly ?string $avatar,
        public readonly ?string $phone,
        public readonly int $roleId
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            matriculationNumber: $data['matriculation_no'] ?? '',
            fullName: $data['full_name'] ?? '',
            email: new Email($data['email'] ?? ''),
            password: $data['password'] ?? '',
            avatar: $data['avatar'] ?? '',
            phone: $data['phone'] ?? '',
            roleId: (int) ($data['role_id'] ?? 0)
        );
    }

    public function getMatriculationNumberAsV0(): MatriculationNumber
    {
        return new MatriculationNumber($this->matriculationNumber);
    }

    public function getEmailAsV0(): Email
    {
        return new Email($this->email);
    }

    public function getPhoneAsV0(): ?PhoneNumber
    {
        return $this->phone ? new PhoneNumber($this->phone) : null;
    }

    public function toArray(): array
    {
        return [
            'matriculation_number' => $this->matriculationNumber,
            'full_name' => $this->fullName,
            'email' => $this->email->getValue(),
            'password' => '[PROTECTED]',
            'avatar' => $this->avatar,
            'phone' => $this->phone,
            'role_id' => $this->roleId,
        ];
    }
}
