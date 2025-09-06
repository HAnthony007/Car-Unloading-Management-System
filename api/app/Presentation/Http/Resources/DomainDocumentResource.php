<?php

namespace App\Presentation\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

final class DomainDocumentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $d = $this->resource;

        return [
            'document_id' => $d->getDocumentId()?->getValue(),
            'document_path' => $d->getDocumentPath(),
            'document_url' => asset('storage/'.ltrim($d->getDocumentPath(), '/')),
            'document_description' => $d->getDocumentDescription(),
            'type' => $d->getType()->getValue(),
            'uploaded_at' => $d->getUploadedAt()->toISOString(),
            'follow_up_file_id' => $d->getFollowUpFileId()?->getValue(),
            'port_call_id' => $d->getPortCallId(),
            'created_at' => $d->getCreatedAt()?->toISOString(),
            'updated_at' => $d->getUpdatedAt()?->toISOString(),
        ];
    }
}
