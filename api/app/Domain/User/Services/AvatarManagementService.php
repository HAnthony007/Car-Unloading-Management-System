<?php

namespace App\Domain\User\Services;

use App\Domain\User\ValueObjects\UserId;

interface AvatarManagementService
{
    public function uploadAvatar(UserId $userId, string $imageData): string;

    public function deleteAvatar(UserId $userId): bool;

    public function generateAvatarUrl(string $avatarFilename): string;

    public function getDefaultAvatar(): string;
}
