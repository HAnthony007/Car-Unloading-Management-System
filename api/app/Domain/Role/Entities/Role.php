<?php

namespace App\Domain\Role\Entities;

use App\Domain\Role\ValueObjects\RoleId;
use Carbon\Carbon;

final class Role
{
    public function __construct(
        private readonly ?RoleId $roleId,
        private readonly string $roleName,
        private readonly ?string $roleDescription,
        private readonly ?Carbon $created_at = null,
        private readonly ?Carbon $updated_at = null
    ) {}

    public function getRoleId(): ?RoleId
    {
        return $this->roleId;
    }

    public function getRoleName(): string
    {
        return $this->roleName;
    }

    public function getRoleDescription(): ?string
    {
        return $this->roleDescription;
    }

    public function getCreatedAt(): ?Carbon
    {
        return $this->created_at;
    }

    public function getUpdatedAt(): ?Carbon
    {
        return $this->updated_at;
    }

    public function isAdministrator(): bool
    {
        return strtolower($this->roleName) === 'administrator' || strtolower($this->roleName) === 'admin';
    }

    public function canManageUsers(): bool
    {
        return $this->isAdministrator() || strtolower($this->roleName) === 'manager';
    }

    public function canViewReports(): bool
    {
        return $this->isAdministrator() || strtolower($this->roleName) === 'manager' || strtolower($this->roleName) === 'supervisor';
    }

    public function getDisplayName(): string
    {
        return ucfirst($this->roleName);
    }

    public function hasDescription(): bool
    {
        return ! empty($this->roleDescription);
    }
}
