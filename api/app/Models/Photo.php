<?php

namespace App\Models;

use App\Domain\Storage\Repositories\StorageRepositoryInterface;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\UploadedFile;

class Photo extends Model
{
    use HasFactory;

    protected $primaryKey = 'photo_id';

    protected $fillable = [
        'photo_path', 'taken_at', 'photo_description', 'discharge_id', 'survey_id', 'checkpoint_id',
    ];

    /**
     * Boot the model and register events.
     */
    protected static function booted(): void
    {
        static::deleting(function (Photo $photo): void {
            // Best-effort deletion of the underlying file from R2 when a photo is removed.
            if (! empty($photo->photo_path)) {
                try {
                    /** @var StorageRepositoryInterface $storage */
                    $storage = app(StorageRepositoryInterface::class);
                    $storage->delete($photo->photo_path);
                } catch (\Throwable $e) {
                    // Silently ignore storage errors to not block DB deletion.
                }
            }
        });
    }

    /**
     * Generate a public URL for this photo if accessible.
     * For private R2 buckets, prefer temporaryUrl().
     */
    public function photoUrl(): ?string
    {
        $path = $this->photo_path;
        if (empty($path)) {
            return null;
        }

        // If already absolute, return as-is
        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
            return $path;
        }

        try {
            /** @var StorageRepositoryInterface $storage */
            $storage = app(StorageRepositoryInterface::class);

            return $storage->url($path);
        } catch (\Throwable $e) {
            return null;
        }
    }

    /**
     * Generate a signed temporary URL for this photo (default 1 hour).
     */
    public function temporaryPhotoUrl(int $expirationSeconds = 3600): ?string
    {
        $path = $this->photo_path;
        if (empty($path)) {
            return null;
        }

        try {
            /** @var StorageRepositoryInterface $storage */
            $storage = app(StorageRepositoryInterface::class);

            return $storage->temporaryUrl($path, $expirationSeconds);
        } catch (\Throwable $e) {
            return null;
        }
    }

    /**
     * Store an uploaded file to R2 and set the photo_path accordingly.
     * Uses a deterministic directory based on known relations when possible.
     */
    public function storeUploadedPhoto(UploadedFile $file, ?string $directory = null, string $visibility = 'public'): string
    {
        /** @var StorageRepositoryInterface $storage */
        $storage = app(StorageRepositoryInterface::class);

        $dir = $directory ?? $this->inferStorageDirectory();
        // Ensure directory ends with a slash so repository generates a unique filename inside it
        if (! str_ends_with($dir, '/')) {
            $dir .= '/';
        }

        $allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
        $maxSize = 5 * 1024 * 1024; // 5MB

        // Use repository validator for images similar to user avatars
        if (method_exists($storage, 'storeUploadedFile')) {
            $storedPath = $storage->storeUploadedFile($file, $dir, $visibility, $allowed, $maxSize);
        } else {
            $storedPath = $storage->store($dir, $file, $visibility);
        }
        // Persist path in-memory; caller is responsible for saving the model
        $this->photo_path = $storedPath;

        return $storedPath;
    }

    /**
     * Infer a default storage directory for this photo based on relations.
     */
    protected function inferStorageDirectory(): string
    {
        if (! empty($this->discharge_id)) {
            return 'photos/discharges/'.$this->discharge_id;
        }
        if (! empty($this->survey_id)) {
            return 'photos/surveys/'.$this->survey_id;
        }
        if (! empty($this->checkpoint_id)) {
            return 'photos/checkpoints/'.$this->checkpoint_id;
        }

        return 'photos/misc';
    }

    public function checkpoint(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(SurveyCheckpoint::class, 'checkpoint_id');
    }

    // vehicle() relation removed

    public function discharge(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Discharge::class, 'discharge_id');
    }

    public function survey(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Survey::class, 'survey_id');
    }
}
