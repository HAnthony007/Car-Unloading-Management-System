<?php

namespace App\Domain\Role\Repositories;

use App\Domain\Role\Entities\Role;
use App\Domain\Role\ValueObjects\RoleId;

interface RoleRepositoryInterface
{
    public function findById(RoleId $roleId): ?Role;
    
    public function findByName(string $roleName): ?Role;
    
    public function findAll(): array;
    
    public function save(Role $role): Role;
    
    public function delete(Role $role): void;

    public function exists(string $roleName): bool;
}