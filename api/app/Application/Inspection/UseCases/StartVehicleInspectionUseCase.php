<?php

namespace App\Application\Inspection\UseCases;

use App\Models\Discharge;
use App\Models\Survey;
use App\Models\SurveyCheckpoint;
use App\Models\SurveyTemplate;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use RuntimeException;

final class StartVehicleInspectionUseCase
{
    /**
     * @return array<int, array{survey: Survey, checkpoints: array<int, SurveyCheckpoint>}>|
     *         array{already_initialized: true, surveys: array<int, Survey>}
     */
    public function execute(int $dischargeId, int $agentId, bool $force = false): array
    {
        $discharge = Discharge::query()->find($dischargeId);
        if (! $discharge) {
            throw new RuntimeException('Discharge not found');
        }

        $existing = Survey::query()->where('discharge_id', $dischargeId)->get();
        if ($existing->isNotEmpty() && ! $force) {
            return [
                'already_initialized' => true,
                'surveys' => $existing->all(),
            ];
        }

        $templates = Cache::remember('survey_templates.active.v1', 300, function () {
            return SurveyTemplate::query()
                ->with(['checkpoints' => function ($q) {
                    $q->where('active', true)->orderBy('order_checkpoint');
                }])
                ->where('active', true)
                ->get();
        });

        if ($templates->isEmpty()) {
            throw new RuntimeException('No active survey templates found');
        }

        return DB::transaction(function () use ($templates, $dischargeId, $agentId, $force, $existing) {
            if ($force && $existing->isNotEmpty()) {
                // Soft reset strategy: we do not delete old data; alternative approach could archive.
            }

            $created = [];
            foreach ($templates as $template) {
                $surveyData = [
                    'survey_name' => $template->name,
                    'survey_description' => $template->description,
                    // When starting an inspection, mark as IN_PROGRESS
                    'overall_status' => 'IN_PROGRESS',
                ];
                $survey = Survey::query()->create([
                    'survey_date' => now(),
                    'survey_name' => $surveyData['survey_name'] ?? 'Survey',
                    'survey_description' => $surveyData['survey_description'] ?? null,
                    'overall_status' => $surveyData['overall_status'] ?? 'IN_PROGRESS',
                    'agent_id' => $agentId,
                    'discharge_id' => $dischargeId,
                ]);

                $checkpointModels = [];
                foreach ($template->checkpoints as $cp) {
                    $checkpointModels[] = SurveyCheckpoint::query()->create([
                        'title_checkpoint' => $cp->title_checkpoint,
                        'comment_checkpoint' => null,
                        'description_checkpoint' => $cp->description_checkpoint,
                        'result_checkpoint' => $cp->default_result_checkpoint,
                        'order_checkpoint' => $cp->order_checkpoint,
                        'survey_id' => $survey->survey_id,
                    ]);
                }

                $created[] = [
                    'survey' => $survey,
                    'checkpoints' => $checkpointModels,
                ];
            }

            return $created;
        });
    }
}
