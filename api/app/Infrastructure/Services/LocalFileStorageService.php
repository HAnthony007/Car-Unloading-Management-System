<?php

namespace App\Infrastructure\Services;

use App\Domain\Storage\Repositories\FileStorageRepositoryInterface;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

final class CloudflareR2FileStorageService implements FileStorageRepositoryInterface
{
    private const DISK = 'r2';

    private const INSPECTION_PHOTOS_DIR = 'inspection-photos';

    public function storeFile(UploadedFile $file, string $directory, string $filename): string
    {
        $extension = $file->getClientOriginalExtension();
        $uniqueFilename = $filename.'_'.Str::random(10).'.'.$extension;
        $path = self::INSPECTION_PHOTOS_DIR.'/'.$directory.'/'.$uniqueFilename;

        Storage::disk(self::DISK)->put($path, file_get_contents($file->getRealPath()));

        return Storage::disk(self::DISK)->url($path);
    }

    public function deleteFile(string $fileUrl): bool
    {
        // Extract the file path from the Cloudflare R2 URL
        $parsedUrl = parse_url($fileUrl);
        $path = ltrim($parsedUrl['path'] ?? '', '/');

        return Storage::disk(self::DISK)->delete($path);
    }

    public function getFileUrl(string $filePath): string
    {
        return Storage::disk(self::DISK)->url($filePath);
    }
}
