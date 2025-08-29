<?php

namespace App\Infrastructure\Persistence\Repositories;

use App\Domain\Storage\Repositories\StorageRepositoryInterface;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use RuntimeException;

class EloquentCloudflareR2StorageRepository implements StorageRepositoryInterface
{
    private string $disk;

    public function __construct(string $disk = 'r2')
    {
        $this->disk = $disk;
    }

    public function store(string $path, $content, string $visibility = 'private'): string
    {
        $fullPath = $this->generateUniquePath($path, $content);

        $success = Storage::disk($this->disk)->put($fullPath, $this->normalizeContents($content), $this->normalizeVisibility($visibility));

        if (! $success) {
            throw new RuntimeException("Failed to store file at path: $fullPath");
        }

        return $fullPath;
    }

    public function delete(string $path): bool
    {
        if (! $this->exists($path)) {
            return false;
        }

        return Storage::disk($this->disk)->delete($path);
    }

    public function url(string $path): string
    {
        if (! $this->exists($path)) {
            throw new RuntimeException("File not found at path: $path");
        }

        return Storage::disk($this->disk)->url($path);
    }

    public function temporaryUrl(string $path, int $expiration = 3600): string
    {
        if (! $this->exists($path)) {
            throw new RuntimeException("File not found at path: $path");
        }

        return Storage::disk($this->disk)->temporaryUrl($path, now()->addSeconds($expiration));
    }

    public function exists(string $path): bool
    {
        return Storage::disk($this->disk)->exists($path);
    }

    public function get(string $path): string
    {
        if (! $this->exists($path)) {
            throw new RuntimeException("File not found at path: $path");
        }

        return Storage::disk($this->disk)->get($path);
    }

    public function copy(string $from, string $to): bool
    {
        if (! $this->exists($from)) {
            throw new RuntimeException("File not found at path: $from");
        }

        return Storage::disk($this->disk)->copy($from, $to);
    }

    public function move(string $from, string $to): bool
    {
        if (! $this->exists($from)) {
            throw new RuntimeException("File not found at path: $from");
        }

        return Storage::disk($this->disk)->move($from, $to);
    }

    public function list(string $path): array
    {
        return Storage::disk($this->disk)->files($path);
    }

    public function size(string $path): int
    {
        if (! $this->exists($path)) {
            throw new RuntimeException("File not found at path: $path");
        }

        return Storage::disk($this->disk)->size($path);
    }

    public function lastModified(string $path): int
    {
        if (! $this->exists($path)) {
            throw new RuntimeException("File not found at path: $path");
        }

        return Storage::disk($this->disk)->lastModified($path);
    }

    public function mimeType(string $path): string
    {
        if (! $this->exists($path)) {
            throw new RuntimeException("File not found at path: $path");
        }

        return Storage::disk($this->disk)->mimeType($path);
    }

    private function generateUniquePath(string $path, $contents): string
    {
        // If the provided path ends with a slash, treat it as a directory
        if (str_ends_with($path, '/')) {
            $directory = rtrim($path, '/');
            $extension = '';
            if ($contents instanceof UploadedFile) {
                $extension = $contents->getClientOriginalExtension();
            }
        } else {
            $directory = pathinfo($path, PATHINFO_DIRNAME);
            $extension = pathinfo($path, PATHINFO_EXTENSION);
            if ($contents instanceof UploadedFile) {
                // Prefer the real extension for uploaded files
                $extension = $contents->getClientOriginalExtension();
            }
        }

        $filename = Str::uuid()->toString();

        if (! empty($extension)) {
            $filename .= '.'.$extension;
        }

        return trim($directory.'/'.$filename, '/');
    }

    private function normalizeContents($contents)
    {
        if ($contents instanceof UploadedFile) {
            return file_get_contents($contents->getRealPath());
        }

        return $contents;
    }

    private function normalizeVisibility(string $visibility): string
    {
        $visibility = strtolower($visibility);

        if (! in_array($visibility, ['public', 'private'])) {
            $visibility = 'private';
        }

        return $visibility;
    }

    public function storeFromUrl(string $path, string $url, string $visibility = 'private'): string
    {
        $contents = file_get_contents($url);

        if ($contents === false) {
            throw new RuntimeException("Failed to download file from url: $url");
        }

        return $this->store($path, $contents, $visibility);
    }

    public function storeUploadedFile(
        UploadedFile $file,
        string $path,
        string $visibility = 'private',
        array $allowedMimeTypes = [],
        int $maxSize = 0
    ): string {
        if (! empty($allowedMimeTypes) && ! in_array($file->getClientMimeType(), $allowedMimeTypes)) {
            throw new RuntimeException(
                'File type not allowed. Allowed types are: '.implode(', ', $allowedMimeTypes)
            );
        }
        if ($maxSize > 0 && $file->getSize() > $maxSize) {
            throw new RuntimeException("File size exceeds maximum allowed size of $maxSize bytes");
        }

        return $this->store($path, $file, $visibility);
    }

    private function formatBytes(int $bytes, int $precision = 2): string
    {
        $units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

        $bytes = max($bytes, 0);
        $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
        $pow = min($pow, count($units) - 1);

        $bytes /= pow(1024, $pow);

        return round($bytes, $precision).' '.$units[$pow];
    }
}
