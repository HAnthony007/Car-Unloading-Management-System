<?php

namespace App\Presentation\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

final class FollowUpFileResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $f = $this->resource;
        $id = $f->getFollowUpFileId()?->getValue();

        return [
            'follow_up_file_id' => $id !== null ? (string) $id : null,
            'bill_of_lading' => $f->getBillOfLading()->getValue(),
            'status' => $f->getStatus()->getValue(),
            'vehicle_id' => $f->getVehicleId()->getValue(),
            'port_call_id' => $f->getPortCallId()->getValue(),
            'created_at' => $f->getCreatedAt()?->toISOString(),
            'updated_at' => $f->getUpdatedAt()?->toISOString(),
        ];
    }
}
