<?php

namespace App\Infrastructure\Persistence\Repositories;

use App\Domain\Survey\ValueObjects\SurveyId;
use App\Domain\SurveyCheckpoint\Entities\SurveyCheckpoint as DomainSurveyCheckpoint;
use App\Domain\SurveyCheckpoint\Repositories\SurveyCheckpointRepositoryInterface;
use App\Domain\SurveyCheckpoint\ValueObjects\CheckpointComment;
use App\Domain\SurveyCheckpoint\ValueObjects\CheckpointTitle;
use App\Domain\SurveyCheckpoint\ValueObjects\SurveyCheckpointId;
use App\Models\SurveyCheckpoint as EloquentSurveyCheckpoint;

final class EloquentSurveyCheckpointRepository implements SurveyCheckpointRepositoryInterface
{
    public function findById(SurveyCheckpointId $id): ?DomainSurveyCheckpoint
    {
        $eloquent = EloquentSurveyCheckpoint::find($id->getValue());

        return $eloquent ? $this->toDomainEntity($eloquent) : null;
    }

    public function findAll(): array
    {
        return EloquentSurveyCheckpoint::all()->map(fn ($e) => $this->toDomainEntity($e))->toArray();
    }

    public function findBySurveyId(SurveyId $surveyId): array
    {
        return EloquentSurveyCheckpoint::where('survey_id', $surveyId->getValue())->get()
            ->map(fn ($e) => $this->toDomainEntity($e))
            ->toArray();
    }

    public function save(DomainSurveyCheckpoint $checkpoint): DomainSurveyCheckpoint
    {
        $eloquent = $checkpoint->getCheckpointId()
            ? EloquentSurveyCheckpoint::find($checkpoint->getCheckpointId()->getValue())
            : new EloquentSurveyCheckpoint;

        if (! $eloquent) {
            $eloquent = new EloquentSurveyCheckpoint;
        }

        $eloquent->title_checkpoint = $checkpoint->getTitle()->getValue();
        $eloquent->comment_checkpoint = $checkpoint->getComment()?->getValue();
        $eloquent->description_checkpoint = $checkpoint->getDescription();
        $eloquent->result_checkpoint = $checkpoint->getResult();
        $eloquent->order_checkpoint = $checkpoint->getOrder();
        $eloquent->survey_id = $checkpoint->getSurveyId()->getValue();
        $eloquent->save();

        return $this->toDomainEntity($eloquent);
    }

    public function delete(SurveyCheckpointId $id): bool
    {
        return EloquentSurveyCheckpoint::destroy($id->getValue()) > 0;
    }

    private function toDomainEntity(EloquentSurveyCheckpoint $e): DomainSurveyCheckpoint
    {
        return new DomainSurveyCheckpoint(
            checkpointId: new SurveyCheckpointId($e->checkpoint_id),
            title: new CheckpointTitle($e->title_checkpoint),
            comment: $e->comment_checkpoint !== null ? new CheckpointComment($e->comment_checkpoint) : null,
            description: $e->description_checkpoint,
            result: $e->result_checkpoint,
            order: $e->order_checkpoint,
            surveyId: new SurveyId($e->survey_id),
            createdAt: $e->created_at,
            updatedAt: $e->updated_at,
        );
    }
}
