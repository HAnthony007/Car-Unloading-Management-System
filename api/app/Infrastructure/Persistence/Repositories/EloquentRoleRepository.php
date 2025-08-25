<?php

namespace App\Infrastructure\Persistence\Repositories;

use App\Domain\Role\Entities\Role;
use App\Domain\Role\Repositories\RoleRepositoryInterface;
use App\Domain\Role\ValueObjects\RoleId;
use App\Models\Role as EloquentRole;

class EloquentRoleRepository implements RoleRepositoryInterface
{
    public function findById(RoleId $roleId): ?Role
    {
        $eloquentRole = EloquentRole::find($roleId->getValue());
        
        if (!$eloquentRole) {
            return null;
        }
        
        return new Role(
            roleId: new RoleId($eloquentRole->role_id),
            roleName: $eloquentRole->role_name,
            roleDescription: $eloquentRole->role_description,
            created_at: $eloquentRole->created_at,
            updated_at: $eloquentRole->updated_at
        );
    }
    
    public function findByName(string $roleName): ?Role
    {
        $eloquentRole = EloquentRole::where('role_name', $roleName)->first();
        
        if (!$eloquentRole) {
            return null;
        }
        
        return new Role(
            roleId: new RoleId($eloquentRole->role_id),
            roleName: $eloquentRole->role_name,
            roleDescription: $eloquentRole->role_description,
            created_at: $eloquentRole->created_at,
            updated_at: $eloquentRole->updated_at
        );
    }
    
    public function findAll(): array
    {
        return EloquentRole::all()->map(function ($eloquentRole) {
            return new Role(
                roleId: new RoleId($eloquentRole->role_id),
                roleName: $eloquentRole->role_name,
                roleDescription: $eloquentRole->role_description,
                created_at: $eloquentRole->created_at,
                updated_at: $eloquentRole->updated_at
            );
        })->toArray();
    }
    
    public function save(Role $role): Role
    {
        // If the domain Role has an id, try to update the existing Eloquent model.
        if ($role->getRoleId()) {
            $eloquentRole = EloquentRole::find($role->getRoleId()->getValue());
            if (!$eloquentRole) {
                // Fallback: create new with provided id (rare in tests)
                $eloquentRole = new EloquentRole();
                $eloquentRole->role_id = $role->getRoleId()->getValue();
            }
        } else {
            $eloquentRole = new EloquentRole();
        }

        $eloquentRole->role_name = $role->getRoleName();
        $eloquentRole->role_description = $role->getRoleDescription();
        $eloquentRole->save();
        
        return new Role(
            roleId: new RoleId($eloquentRole->role_id),
            roleName: $eloquentRole->role_name,
            roleDescription: $eloquentRole->role_description,
            created_at: $eloquentRole->created_at,
            updated_at: $eloquentRole->updated_at
        );
    }
    
    public function delete(Role $role): void
    {
        if ($role->getRoleId()) {
            EloquentRole::destroy($role->getRoleId()->getValue());
        }
    }
    
    public function exists(string $roleName): bool
    {
        return EloquentRole::where('role_name', $roleName)->exists();
    }
}
