<?php

namespace App\Application\User\UseCases;

use App\Domain\Storage\Repositories\StorageRepositoryInterface;
use App\Domain\User\Repositories\UserRepositoryInterface;
use App\Domain\User\ValueObjects\UserId;

class ManageUserAvatarUserCase
{
    private array $allowedMimeTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/svg+xml',
    ];

    private int $maxFileSize = 5 * 1024 * 1024;

    public function __construct(
        private StorageRepositoryInterface $storageRepository,
        private UserRepositoryInterface $userRepository,
    ) {}

    public function uploadAvatar(int $userId, $file): string
    {
        try {
            $user = $this->userRepository->findById(new UserId($userId));

            if (! $user) {
                throw new \Exception('User not found.');
            }

            if ($user->getAvatar()) {
                $this->storageRepository->delete($user->getAvatar());
            }

            $avatarPath = $this->storageRepository->storeUploadedFile(
                $file,
                'avatars/'.$userId.'/',
                'public',
                $this->allowedMimeTypes,
                $this->maxFileSize
            );

            $user->setAvatar($avatarPath);
            $this->userRepository->save($user);

            return $avatarPath;
        } catch (\Exception $exception) {
            throw new \Exception($exception->getMessage());
        }
    }

    public function deleteAvatar(int $userId): bool
    {
        try {
            $user = $this->userRepository->findById(new UserId($userId));

            if (! $user) {
                throw new \Exception('User not found.');
            }

            if (! $user->getAvatar()) {
                return false;
            }

            $success = $this->storageRepository->delete($user->getAvatar());

            if ($success) {
                $user->setAvatar(null);
                $this->userRepository->save($user);
            }

            return $success;
        } catch (\Exception $exception) {
            throw new \Exception($exception->getMessage());
        }
    }

    public function getAvatar(int $userId, bool $temporary = false): ?string
    {
        try {
            $user = $this->userRepository->findById(new UserId($userId));

            if (! $user || ! $user->getAvatar()) {
                return null;
            }

            if ($temporary) {
                return $this->storageRepository->temporaryUrl($user->getAvatar(), 3600);
            }

            return $this->storageRepository->url($user->getAvatar());
        } catch (\Exception $exception) {
            throw new \Exception($exception->getMessage());
        }
    }
}
