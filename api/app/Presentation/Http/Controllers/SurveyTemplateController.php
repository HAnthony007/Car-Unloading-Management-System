<?php

namespace App\Presentation\Http\Controllers;

use App\Models\SurveyTemplate;
use App\Models\SurveyTemplateCheckpoint;
use App\Presentation\Http\Requests\StoreSurveyTemplateCheckpointRequest;
use App\Presentation\Http\Requests\StoreSurveyTemplateRequest;
use App\Presentation\Http\Requests\UpdateSurveyTemplateCheckpointRequest;
use App\Presentation\Http\Requests\UpdateSurveyTemplateRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;

class SurveyTemplateController extends Controller
{
    public function index(): JsonResponse
    {
        $templates = SurveyTemplate::with('checkpoints')->get();

        return response()->json(['data' => $templates]);
    }

    public function store(StoreSurveyTemplateRequest $request): JsonResponse
    {
        $data = $request->validated();
        $template = SurveyTemplate::create([
            'template_key' => $data['template_key'],
            'name' => $data['name'],
            'description' => $data['description'] ?? null,
            'default_overall_status' => $data['default_overall_status'] ?? 'PENDING',
            'active' => true,
            'created_by' => $request->user()?->user_id,
        ]);

        foreach ($data['checkpoints'] as $cp) {
            SurveyTemplateCheckpoint::create([
                'survey_template_id' => $template->survey_template_id,
                'title_checkpoint' => $cp['title_checkpoint'],
                'description_checkpoint' => $cp['description_checkpoint'] ?? null,
                'default_result_checkpoint' => $cp['default_result_checkpoint'] ?? null,
                'order_checkpoint' => $cp['order_checkpoint'] ?? null,
                'active' => true,
            ]);
        }
        Cache::forget('survey_templates.active.v1');

        return response()->json(['message' => 'Template created', 'data' => $template->load('checkpoints')], 201);
    }

    public function show(int $id): JsonResponse
    {
        $template = SurveyTemplate::with('checkpoints')->find($id);
        if (! $template) {
            return response()->json(['message' => 'Not found'], 404);
        }

        return response()->json(['data' => $template]);
    }

    public function update(UpdateSurveyTemplateRequest $request, int $id): JsonResponse
    {
        $template = SurveyTemplate::find($id);
        if (! $template) {
            return response()->json(['message' => 'Not found'], 404);
        }
        $template->fill($request->validated());
        $template->save();
        Cache::forget('survey_templates.active.v1');

        return response()->json(['message' => 'Template updated', 'data' => $template->load('checkpoints')]);
    }

    public function storeCheckpoint(StoreSurveyTemplateCheckpointRequest $request, int $id): JsonResponse
    {
        $template = SurveyTemplate::find($id);
        if (! $template) {
            return response()->json(['message' => 'Not found'], 404);
        }
        $data = $request->validated();
        $checkpoint = SurveyTemplateCheckpoint::create([
            'survey_template_id' => $template->survey_template_id,
            'title_checkpoint' => $data['title_checkpoint'],
            'description_checkpoint' => $data['description_checkpoint'] ?? null,
            'default_result_checkpoint' => $data['default_result_checkpoint'] ?? null,
            'order_checkpoint' => $data['order_checkpoint'] ?? null,
            'active' => true,
        ]);
        Cache::forget('survey_templates.active.v1');

        return response()->json(['message' => 'Checkpoint added', 'data' => $checkpoint], 201);
    }

    public function updateCheckpoint(UpdateSurveyTemplateCheckpointRequest $request, int $checkpointId): JsonResponse
    {
        $checkpoint = SurveyTemplateCheckpoint::find($checkpointId);
        if (! $checkpoint) {
            return response()->json(['message' => 'Not found'], 404);
        }
        $checkpoint->fill($request->validated());
        $checkpoint->save();
        Cache::forget('survey_templates.active.v1');

        return response()->json(['message' => 'Checkpoint updated', 'data' => $checkpoint]);
    }

    public function destroy(int $id): JsonResponse
    {
        $template = SurveyTemplate::find($id);
        if (! $template) {
            return response()->json(['message' => 'Not found'], 404);
        }
        $template->active = false;
        $template->save();
        Cache::forget('survey_templates.active.v1');

        return response()->json(['message' => 'Template deactivated']);
    }

    public function destroyCheckpoint(int $checkpointId): JsonResponse
    {
        $checkpoint = SurveyTemplateCheckpoint::find($checkpointId);
        if (! $checkpoint) {
            return response()->json(['message' => 'Not found'], 404);
        }
        $checkpoint->active = false;
        $checkpoint->save();
        Cache::forget('survey_templates.active.v1');

        return response()->json(['message' => 'Checkpoint deactivated']);
    }
}
