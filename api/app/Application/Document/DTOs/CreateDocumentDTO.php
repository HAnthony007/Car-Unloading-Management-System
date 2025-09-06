<?php

namespace App\Application\Document\DTOs;

use Carbon\Carbon;

final class CreateDocumentDTO
{
    public function __construct(
        public readonly string $documentPath,
        public readonly ?string $documentDescription,
        public readonly string $type,
        public readonly string $uploadedAt,
        public readonly int $followUpFileId,
        public readonly int $portCallId,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            documentPath: $data['document_path'] ?? '',
            documentDescription: $data['document_description'] ?? null,
            type: $data['type'] ?? 'generic',
            uploadedAt: $data['uploaded_at'] ?? Carbon::now()->toISOString(),
            followUpFileId: (int) ($data['follow_up_file_id'] ?? 0),
            portCallId: (int) ($data['port_call_id'] ?? 0),
        );
    }
}
