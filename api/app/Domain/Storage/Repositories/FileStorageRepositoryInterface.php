<?php

namespace App\Domain\Storage\Repositories;

use Illuminate\Http\UploadedFile;

interface FileStorageRepositoryInterface
{
    public function storeFile(UploadedFile $file, string $directory, string $filename): string;

    public function deleteFile(string $fileUrl): bool;

    public function getFileUrl(string $filePath): string;

    public function storeInspectionPhoto(UploadedFile $file, int $checkpointId): string;

    public function deleteCheckpointPhotos(int $checkpointId): bool;
}
