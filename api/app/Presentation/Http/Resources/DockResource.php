<?php

namespace App\Presentation\Http\Resources;

use App\Domain\Dock\Entities\Dock;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

final class DockResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        /** @var Dock $dock */
        $dock = $this->resource;

        return [
            'dock_id' => $dock->getDockId()?->getValue(),
            'dock_name' => $dock->getDockName()->getValue(),
            'location' => $dock->getLocation()->getValue(),
            'created_at' => $dock->getCreatedAt()?->toISOString(),
            'updated_at' => $dock->getUpdatedAt()?->toISOString(),
        ];
    }
}
