<?php

namespace App\Infrastructure\Services;

use App\Domain\User\Services\AvatarManagementService;
use App\Domain\User\ValueObjects\UserId;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

final class LaravelAvatarManagementService implements AvatarManagementService
{
    private const AVATAR_DISK = 'public';

    private const AVATAR_DIRECTORY = 'avatars';

    public function uploadAvatar(UserId $userId, string $imageData): string
    {
        if (str_starts_with($imageData, 'data:image/')) {
            $imageData = substr($imageData, strpos($imageData, ',') + 1);
            $imageData = base64_decode($imageData);
        }

        $filename = $userId->getValue().'_'.Str::random(10).'.jpg';
        $path = self::AVATAR_DIRECTORY.'/'.$filename;

        $this->deleteExistingAvatar($userId);

        Storage::disk(self::AVATAR_DISK)->put($path, $imageData);

        return $filename;
    }

    public function deleteAvatar(UserId $userId): bool
    {
        return $this->deleteExistingAvatar($userId);
    }

    public function generateAvatarUrl(string $avatarFilename): string
    {
        if (str_starts_with($avatarFilename, 'http')) {
            return $avatarFilename;
        }

        return Storage::disk(self::AVATAR_DISK)->url(self::AVATAR_DIRECTORY.'/'.$avatarFilename);
    }

    public function getDefaultAvatar(): string
    {
        return asset('images/default-avatar.png');
    }

    private function deleteExistingAvatar(UserId $userId): bool
    {
        $files = Storage::disk(self::AVATAR_DISK)->files(self::AVATAR_DIRECTORY);
        $pattern = '/^'.preg_quote(self::AVATAR_DIRECTORY.'/'.$userId->getValue(), '/').'_/';

        $deleted = false;

        foreach ($files as $file) {
            if (preg_match($pattern, $file)) {
                Storage::disk(self::AVATAR_DISK)->delete($file);
                $deleted = true;
            }
        }

        return $deleted;
    }
}
