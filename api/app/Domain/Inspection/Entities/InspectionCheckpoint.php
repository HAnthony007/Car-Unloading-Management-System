<?php

namespace App\Domain\Inspection\Entities;

use App\Domain\Inspection\ValueObjects\CheckpointId;
use App\Domain\Inspection\ValueObjects\CheckpointStatus;
use Carbon\Carbon;

final class InspectionCheckpoint
{
    private CheckpointStatus $status;

    private ?string $comment;

    private array $photos;

    public function __construct(
        private readonly CheckpointId $checkpointId,
        private readonly string $title,
        private readonly string $description,
        private readonly int $order,
        CheckpointStatus $status = CheckpointStatus::PENDING,
        ?string $comment = null,
        array $photos = [],
        private readonly ?Carbon $createdAt = null,
        private readonly ?Carbon $updatedAt = null,
    ) {
        $this->status = $status;
        $this->comment = $comment;
        $this->photos = $photos;
    }

    public function getCheckpointId(): CheckpointId
    {
        return $this->checkpointId;
    }

    public function getTitle(): string
    {
        return $this->title;
    }

    public function getDescription(): string
    {
        return $this->description;
    }

    public function getOrder(): int
    {
        return $this->order;
    }

    public function getStatus(): CheckpointStatus
    {
        return $this->status;
    }

    public function getComment(): ?string
    {
        return $this->comment;
    }

    public function getPhotos(): array
    {
        return $this->photos;
    }

    public function getCreatedAt(): ?Carbon
    {
        return $this->createdAt;
    }

    public function getUpdatedAt(): ?Carbon
    {
        return $this->updatedAt;
    }

    public function updateStatus(CheckpointStatus $status): void
    {
        $this->status = $status;
    }

    public function updateComment(?string $comment): void
    {
        $this->comment = $comment;
    }

    public function addPhoto(string $photoUrl): void
    {
        $this->photos[] = $photoUrl;
    }

    public function removePhoto(int $index): void
    {
        if (isset($this->photos[$index])) {
            unset($this->photos[$index]);
            $this->photos = array_values($this->photos); // Re-index array
        }
    }

    public function toArray(): array
    {
        return [
            'id' => $this->checkpointId->getValue(),
            'title_checkpoint' => $this->title,
            'description_checkpoint' => $this->description,
            'order_checkpoint' => $this->order,
            'status' => $this->status->getValue(),
            'comment' => $this->comment,
            'photos' => $this->photos,
            'created_at' => $this->createdAt?->toISOString(),
            'updated_at' => $this->updatedAt?->toISOString(),
        ];
    }
}
