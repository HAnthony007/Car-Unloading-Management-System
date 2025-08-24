<?php

namespace App\Presentation\Http\Resources;

use App\Domain\Role\Entities\Role;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

final class RoleResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $role = $this->resource;

        return [
            'role_id' => $role->getRoleId()?->getValue(),
            'role_name' => $role->getRoleName(),
            'display_name' => $role->getDisplayName(),
            'role_description' => $role->getRoleDescription(),
            'has_description' => $role->hasDescription(),

            'permissions' => [
                'is_administrator' => $role->isAdministrator(),
                'can_manage_users' => $role->canManageUsers(),
                'can_vew_reports' => $role->canViewReports(),
            ],

            'created_at' => $role->getCreatedAt()?->toISOString(),
            'updated_at' => $role->getUpdatedAt()?->toISOString(),


        ];
    }
}