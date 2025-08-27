<?php

namespace App\Domain\Document\Services;

interface DocumentStorageService
{
    public function store(string $contents, string $extension, ?string $directory = null): string;

    public function delete(string $path): bool;

    public function url(string $path): string;
}
