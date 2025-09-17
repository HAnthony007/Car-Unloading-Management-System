<?php

namespace App\Presentation\Http\Controllers;

use App\Application\Inspection\UseCases\GetDischargeInspectionUseCase;
use App\Application\Inspection\UseCases\StartVehicleInspectionUseCase;
use App\Models\Discharge;
use App\Presentation\Http\Requests\StartInspectionRequest;
use App\Presentation\Http\Resources\SurveyWithCheckpointsResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

final class InspectionController extends Controller
{
    public function __construct(
        private readonly StartVehicleInspectionUseCase $useCase,
        private readonly GetDischargeInspectionUseCase $getInspectionUseCase,
    ) {}

    public function start(StartInspectionRequest $request): JsonResponse
    {
        $data = $request->validated();
        $agentId = Auth::id();
        $force = (bool) ($data['force'] ?? false);

        $result = $this->useCase->execute((int) $data['discharge_id'], (int) $agentId, $force);

        if (isset($result['already_initialized'])) {
            return response()->json([
                'message' => 'Inspection déjà initialisée pour ce discharge.',
                'data' => array_map(fn ($s) => [
                    'survey_id' => $s->survey_id,
                    'survey_name' => $s->survey_name,
                ], $result['surveys']),
            ], 200);
        }

        // TODO: Harmoniser ce format avec SurveyWithCheckpointsResource (si besoin conserver structure actuelle côté front).
        return response()->json([
            'message' => 'Inspection initialisée.',
            'data' => array_map(fn ($row) => [
                'survey_id' => $row['survey']->survey_id,
                'survey_name' => $row['survey']->survey_name,
                'checkpoints' => array_map(fn ($c) => [
                    'checkpoint_id' => $c->checkpoint_id,
                    'title_checkpoint' => $c->title_checkpoint,
                    'order_checkpoint' => $c->order_checkpoint,
                ], $row['checkpoints']),
            ], $result),
        ], 201);
    }

    /**
     * GET /discharges/{id}/inspection
     * Returns the inspection (surveys + checkpoints) initialized for a discharge.
     * If no surveys exist yet, 404 is returned (client can then POST /inspections/start).
     */
    public function showByDischarge(int $id): JsonResponse
    {
        // Ensure discharge exists first
        $discharge = Discharge::query()->find($id);
        if (! $discharge) {
            return response()->json(['error' => 'Discharge not found.'], 404);
        }

        $viewModels = $this->getInspectionUseCase->execute($id);

        if (empty($viewModels)) {
            return response()->json([
                'error' => 'Inspection not initialized for this discharge.',
            ], 404);
        }

        return response()->json([
            'data' => SurveyWithCheckpointsResource::collection(collect($viewModels)),
        ]);
    }
}
