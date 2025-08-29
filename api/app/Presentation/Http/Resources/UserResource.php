<?php

namespace App\Presentation\Http\Resources;

use App\Domain\User\Entities\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

final class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $user = $this->resource;

        return [
            'user_id' => $user->getUserId()?->getValue(),
            'matriculation_number' => $user->getMatriculationNumber()->getValue(),
            'matriculation_info' => [
                'prefix' => $user->getMatriculationNumber()->getPrefix(),
                'year' => $user->getMatriculationNumber()->getYear(),
                'sequence' => $user->getMatriculationNumber()->getSequence(),
            ],
            'full_name' => $user->getFullName(),
            'first_name' => $user->getFirstName(),
            'last_name' => $user->getLastName(),
            'display_name' => $user->getDisplayName(),
            'email' => $user->getEmail()->getValue(),
            'email_verified' => $user->isEmailVerified(),
            'email_verified_at' => $user->getEmailVerifiedAt()?->toISOString(),
            'avatar' => [
                'path' => $user->getAvatar(),
                'url' => $user->getAvatarUrl(),
            ],
            'phone' => $user->getPhoneNumber()?->getValue(),
            'has_phone' => $user->hasPhoneNumber(),
            'role_id' => $user->getRoleId()->getValue(),
            'role' => $user->getRole() ? new RoleResource($user->getRole()) : null,
            'is_active' => $user->isActive(),
            'last_login_at' => $user->getLastLoginAt()?->toISOString(),
            'created_at' => $user->getCreatedAt()?->toISOString(),
            'updated_at' => $user->getUpdatedAt()?->toISOString(),

            // 'role' => new

            // Metadata calculated fields
            'profile_completion' => $this->calculateProfileCompletion($user),
            'account_age_days' => $user->getCreatedAt()?->diffInDays(now()) ?? 0,
        ];
    }

    private function calculateProfileCompletion(User $user): float
    {
        $fields = [
            'email' => true,
            'full_name' => ! empty($user->getFullName()),
            'phone' => $user->hasPhoneNumber(),
            'avatar' => $user->hasAvatar(),
            'email_verified' => $user->isEmailVerified(),
        ];

        $completed = count(array_filter($fields));
        $total = count($fields);

        return round(($completed / $total) * 100, 2);
    }
}
