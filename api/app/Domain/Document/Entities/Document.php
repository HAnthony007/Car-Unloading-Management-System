<?php

namespace App\Domain\Document\Entities;

use App\Domain\Document\ValueObjects\DocumentId;
use App\Domain\Document\ValueObjects\DocumentType;
use App\Domain\FollowUpFile\ValueObjects\FollowUpFileId;
use Carbon\Carbon;

final class Document
{
    public function __construct(
        private readonly ?DocumentId $documentId,
        private readonly string $documentPath,
        private readonly ?string $documentDescription,
        private readonly DocumentType $type,
        private readonly Carbon $uploadedAt,
        private readonly FollowUpFileId $followUpFileId,
        private readonly int $portCallId,
        private readonly ?Carbon $createdAt = null,
        private readonly ?Carbon $updatedAt = null,
    ) {}

    public function getDocumentId(): ?DocumentId
    {
        return $this->documentId;
    }

    public function getDocumentPath(): string
    {
        return $this->documentPath;
    }

    public function getDocumentDescription(): ?string
    {
        return $this->documentDescription;
    }

    public function getType(): DocumentType
    {
        return $this->type;
    }

    public function getUploadedAt(): Carbon
    {
        return $this->uploadedAt;
    }

    public function getFollowUpFileId(): FollowUpFileId
    {
        return $this->followUpFileId;
    }

    public function getPortCallId(): int
    {
        return $this->portCallId;
    }

    public function getCreatedAt(): ?Carbon
    {
        return $this->createdAt;
    }

    public function getUpdatedAt(): ?Carbon
    {
        return $this->updatedAt;
    }

    public function toArray(): array
    {
        return [
            'document_id' => $this->documentId?->getValue(),
            'document_path' => $this->documentPath,
            'document_description' => $this->documentDescription,
            'type' => $this->type,
            'uploaded_at' => $this->uploadedAt->toISOString(),
            'follow_up_file_id' => $this->followUpFileId->getValue(),
            'port_call_id' => $this->portCallId,
            'created_at' => $this->createdAt?->toISOString(),
            'updated_at' => $this->updatedAt?->toISOString(),
        ];
    }
}
