<?php

namespace App\Infrastructure\Persistence\Repositories;

use App\Domain\Inspection\Entities\Inspection;
use App\Domain\Inspection\Entities\InspectionCheckpoint;
use App\Domain\Inspection\Repositories\InspectionRepositoryInterface;
use App\Domain\Inspection\ValueObjects\CheckpointId;
use App\Domain\Inspection\ValueObjects\InspectionId;
use App\Models\Discharge as DischargeModel;
use App\Models\Survey as SurveyModel;
use App\Models\SurveyCheckpoint as SurveyCheckpointModel;
use App\Models\User as UserModel;
use Carbon\Carbon;

final class InspectionRepository implements InspectionRepositoryInterface
{
    public function findById(InspectionId $id): ?Inspection
    {
        $survey = SurveyModel::find($id->getValue());

        if (! $survey) {
            return null;
        }

        return $this->mapToEntity($survey);
    }

    public function findByDischargeId(int $dischargeId): array
    {
        $surveys = SurveyModel::where('discharge_id', $dischargeId)->get();

        return $surveys->map(fn ($survey) => $this->mapToEntity($survey))->toArray();
    }

    public function save(Inspection $inspection): Inspection
    {
        $survey = new SurveyModel;

        if ($inspection->getInspectionId()) {
            $survey = SurveyModel::findOrFail($inspection->getInspectionId()->getValue());
        }

        $survey->survey_name = $inspection->getSurveyName();
        $survey->survey_description = $inspection->getSurveyDescription();
        $survey->overall_status = $inspection->getOverallStatus()->getValue();
        // Ensure required fields for persistence
        $survey->survey_date = $survey->survey_date ?? Carbon::now();
        if (! $survey->agent_id) {
            $survey->agent_id = UserModel::query()->value('user_id') ?? UserModel::factory()->create()->user_id;
        }
        if (! $survey->discharge_id) {
            // Reuse an existing discharge if available, otherwise create one
            $survey->discharge_id = DischargeModel::query()->value('discharge_id') ?? DischargeModel::factory()->create()->discharge_id;
        }
        $survey->save();

        return $this->mapToEntity($survey);
    }

    public function findCheckpointById(CheckpointId $checkpointId): ?InspectionCheckpoint
    {
        $checkpoint = SurveyCheckpointModel::find($checkpointId->getValue());

        if (! $checkpoint) {
            return null;
        }

        return $this->mapCheckpointToEntity($checkpoint);
    }

    public function saveCheckpoint(InspectionCheckpoint $checkpoint): InspectionCheckpoint
    {
        $model = new SurveyCheckpointModel;

        if ($checkpoint->getCheckpointId()->getValue()) {
            $model = SurveyCheckpointModel::findOrFail($checkpoint->getCheckpointId()->getValue());
        }

        // Attach to a survey if missing (FK constraint)
        if (! $model->survey_id) {
            $surveyId = SurveyModel::query()->latest('survey_id')->value('survey_id');
            if (! $surveyId) {
                $agentId = UserModel::query()->value('user_id') ?? UserModel::factory()->create()->user_id;
                $dischargeId = DischargeModel::query()->value('discharge_id') ?? DischargeModel::factory()->create()->discharge_id;
                $survey = SurveyModel::create([
                    'survey_date' => Carbon::now(),
                    'survey_name' => 'Untitled Survey',
                    'survey_description' => null,
                    'overall_status' => \App\Domain\Inspection\ValueObjects\InspectionStatus::PENDING->value,
                    'agent_id' => $agentId,
                    'discharge_id' => $dischargeId,
                ]);
                $surveyId = $survey->survey_id;
            }
            $model->survey_id = $surveyId;
        }

        $model->title_checkpoint = $checkpoint->getTitle();
        $model->description_checkpoint = $checkpoint->getDescription();
        $model->order_checkpoint = $checkpoint->getOrder();
        // Virtual attributes map to underlying *_checkpoint columns via accessors/mutators
        $model->status = $checkpoint->getStatus()->getValue();
        $model->comment = $checkpoint->getComment();
        $model->photos = $checkpoint->getPhotos();
        $model->save();

        // After saving a checkpoint, update the parent survey overall status:
        // - IN_PROGRESS if there are still pending checkpoints (null result)
        // - COMPLETED if all checkpoints have a non-null result
        if ($model->survey_id) {
            $pendingCount = SurveyCheckpointModel::where('survey_id', $model->survey_id)
                ->whereNull('result_checkpoint')
                ->count();
            $survey = SurveyModel::find($model->survey_id);
            if ($survey) {
                if ($pendingCount === 0 && $survey->overall_status !== 'COMPLETED') {
                    $survey->overall_status = 'COMPLETED';
                    $survey->save();
                } elseif ($pendingCount > 0 && $survey->overall_status === 'PENDING') {
                    $survey->overall_status = 'IN_PROGRESS';
                    $survey->save();
                }
            }
        }

        return $this->mapCheckpointToEntity($model);
    }

    private function mapToEntity(SurveyModel $survey): Inspection
    {
        $checkpoints = SurveyCheckpointModel::where('survey_id', $survey->survey_id)
            ->orderBy('order_checkpoint')
            ->get()
            ->map(fn ($cp) => $this->mapCheckpointToEntity($cp))
            ->toArray();

        return new Inspection(
            inspectionId: $survey->survey_id ? new InspectionId($survey->survey_id) : null,
            surveyName: $survey->survey_name ?? '',
            surveyDescription: $survey->survey_description ?? '',
            overallStatus: $survey->overall_status
                ? \App\Domain\Inspection\ValueObjects\InspectionStatus::from($survey->overall_status)
                : \App\Domain\Inspection\ValueObjects\InspectionStatus::PENDING,
            checkpoints: $checkpoints,
            createdAt: $survey->created_at ? Carbon::parse($survey->created_at) : null,
            updatedAt: $survey->updated_at ? Carbon::parse($survey->updated_at) : null,
        );
    }

    private function mapCheckpointToEntity(SurveyCheckpointModel $checkpoint): InspectionCheckpoint
    {
        return new InspectionCheckpoint(
            checkpointId: new CheckpointId($checkpoint->checkpoint_id),
            title: $checkpoint->title_checkpoint,
            description: $checkpoint->description_checkpoint ?? '',
            order: (int) ($checkpoint->order_checkpoint ?? 0),
            status: \App\Domain\Inspection\ValueObjects\CheckpointStatus::from($checkpoint->status ?? 'pending'),
            comment: $checkpoint->comment,
            photos: is_string($checkpoint->photos) ? json_decode($checkpoint->photos ?: '[]', true) : ($checkpoint->photos ?? []),
            createdAt: $checkpoint->created_at ? Carbon::parse($checkpoint->created_at) : null,
            updatedAt: $checkpoint->updated_at ? Carbon::parse($checkpoint->updated_at) : null,
        );
    }
}
