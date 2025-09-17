<?php

namespace App\Presentation\Http\Resources;

use App\Application\Inspection\DTOs\SurveyWithCheckpointsViewModel;
use App\Domain\SurveyCheckpoint\Entities\SurveyCheckpoint as DomainCheckpoint;
use App\Models\Survey as EloquentSurvey;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Standardised representation of a Survey including its checkpoints.
 */
class SurveyWithCheckpointsResource extends JsonResource
{
    /** @var EloquentSurvey|SurveyWithCheckpointsViewModel */
    public $resource;

    public function toArray(Request $request): array
    {
        $resource = $this->resource;

        // Normalise to scalar + checkpoints arrays
        if ($resource instanceof SurveyWithCheckpointsViewModel) {
            $survey = $resource->survey; // Domain survey entity
            $checkpoints = $resource->checkpoints; // array of domain checkpoints

            return [
                'survey_id' => $survey->getSurveyId()?->getValue(),
                'survey_name' => $survey->getSurveyName()->getValue(),
                'overall_status' => $survey->getOverallStatus()->getValue(),
                'survey_description' => $survey->getSurveyDescription()->getValue(),
                'survey_date' => $survey->getSurveyDate()->getValue()?->toIso8601String(),
                'checkpoints' => array_map(fn (DomainCheckpoint $c) => [
                    'checkpoint_id' => $c->getCheckpointId()->getValue(),
                    'title_checkpoint' => $c->getTitle()->getValue(),
                    'description_checkpoint' => $c->getDescription(),
                    'comment_checkpoint' => $c->getComment()?->getValue(),
                    'result_checkpoint' => $c->getResult(),
                    'order_checkpoint' => $c->getOrder(),
                ], $checkpoints),
            ];
        }

        $s = $resource; // Eloquent Survey instance

        return [
            'survey_id' => $s->survey_id,
            'survey_name' => $s->survey_name,
            'overall_status' => $s->overall_status,
            'survey_description' => $s->survey_description,
            'survey_date' => $s->getAttribute('survey_date') instanceof \Carbon\Carbon
                ? $s->getAttribute('survey_date')->toIso8601String()
                : ($s->survey_date ?? null),
            'checkpoints' => $s->relationLoaded('checkpoints')
                ? $s->checkpoints->map(fn ($c) => [
                    'checkpoint_id' => $c->checkpoint_id,
                    'title_checkpoint' => $c->title_checkpoint,
                    'description_checkpoint' => $c->description_checkpoint,
                    'comment_checkpoint' => $c->comment_checkpoint,
                    'result_checkpoint' => $c->result_checkpoint,
                    'order_checkpoint' => $c->order_checkpoint,
                ])->all()
                : [],
        ];
    }
}
