<?php

namespace App\Presentation\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

final class SurveyResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $s = $this->resource;

        return [
            'survey_id' => $s->getSurveyId()?->getValue(),
            'date' => $s->getDate()->getValue()?->toDateString(),
            'result' => $s->getResult()->getValue(),
            'user_id' => $s->getUserId()->getValue(),
            'follow_up_file_id' => $s->getFollowUpFileId()->getValue(),
            'created_at' => $s->getCreatedAt()?->toISOString(),
            'updated_at' => $s->getUpdatedAt()?->toISOString(),
        ];
    }
}
