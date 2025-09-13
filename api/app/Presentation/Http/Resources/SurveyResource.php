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
            'survey_date' => $s->getSurveyDate()->getValue()?->toISOString(),
            'survey_name' => $s->getSurveyName()->getValue(),
            'survey_description' => $s->getSurveyDescription()->getValue(),
            'overall_status' => $s->getOverallStatus()->getValue(),
            'agent_id' => $s->getAgentId()->getValue(),
            'discharge_id' => $s->getDischargeId()->getValue(),
            'created_at' => $s->getCreatedAt()?->toISOString(),
            'updated_at' => $s->getUpdatedAt()?->toISOString(),
        ];
    }
}
