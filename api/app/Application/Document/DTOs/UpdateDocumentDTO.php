<?php

namespace App\Application\Document\DTOs;

final class UpdateDocumentDTO
{
    public function __construct(
        public readonly int $documentId,
        public readonly ?string $documentPath = null,
        public readonly ?string $documentDescription = null,
        public readonly ?string $type = null,
        public readonly ?string $uploadedAt = null,
        public readonly ?int $followUpFileId = null,
        public readonly ?int $portCallId = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            documentId: (int) $data['document_id'],
            documentPath: $data['document_path'] ?? null,
            documentDescription: $data['document_description'] ?? null,
            type: $data['type'] ?? null,
            uploadedAt: $data['uploaded_at'] ?? null,
            followUpFileId: isset($data['follow_up_file_id']) ? (int) $data['follow_up_file_id'] : null,
            portCallId: isset($data['port_call_id']) ? (int) $data['port_call_id'] : null,
        );
    }
}
