<?php

namespace App\Infrastructure\Services;

use App\Domain\Document\Services\DocumentStorageService;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

final class LaravelDocumentStorageService implements DocumentStorageService
{
    private const DISK = 'public';

    private const BASE_DIR = 'documents';

    public function store(string $contents, string $extension, ?string $directory = null): string
    {
        $dir = trim($directory ?: self::BASE_DIR, '/');
        $ext = ltrim($extension, '.');
        $filename = Str::uuid()->toString().($ext ? '.'.$ext : '');
        $path = $dir.'/'.$filename;

        Storage::disk(self::DISK)->put($path, $contents);

        return $path; // relative path within disk
    }

    public function delete(string $path): bool
    {
        return Storage::disk(self::DISK)->delete($path);
    }

    public function url(string $path): string
    {
        return asset('storage/'.ltrim($path, '/'));
    }
}
