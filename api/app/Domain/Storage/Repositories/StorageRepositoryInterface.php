<?php

namespace App\Domain\Storage\Repositories;

interface StorageRepositoryInterface
{
    public function store(string $path, $content, string $visibility = 'private'): string;

    public function delete(string $path): bool;

    public function url(string $path): string;

    public function temporaryUrl(string $path, int $expiration = 3600): string;

    public function exists(string $path): bool;

    public function get(string $path): string;

    public function copy(string $from, string $to): bool;

    public function move(string $from, string $to): bool;

    public function list(string $path): array;

    public function size(string $path): int;

    public function lastModified(string $path): int;

    public function mimeType(string $path): string;
}
