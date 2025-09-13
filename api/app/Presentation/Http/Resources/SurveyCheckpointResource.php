<?php

namespace App\Presentation\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

final class SurveyCheckpointResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $c = $this->resource;

        return [
            'checkpoint_id' => $c->getCheckpointId()?->getValue(),
            'title_checkpoint' => $c->getTitle()->getValue(),
            'comment_checkpoint' => $c->getComment()?->getValue(),
            'description_checkpoint' => $c->getDescription(),
            'result_checkpoint' => $c->getResult(),
            'order_checkpoint' => $c->getOrder(),
            'survey_id' => $c->getSurveyId()->getValue(),
            'created_at' => $c->getCreatedAt()?->toISOString(),
            'updated_at' => $c->getUpdatedAt()?->toISOString(),
        ];
    }
}
