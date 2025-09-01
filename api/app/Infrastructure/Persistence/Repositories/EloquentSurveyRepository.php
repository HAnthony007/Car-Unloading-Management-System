<?php

namespace App\Infrastructure\Persistence\Repositories;

use App\Domain\FollowUpFile\ValueObjects\FollowUpFileId;
use App\Domain\Survey\Entities\Survey as DomainSurvey;
use App\Domain\Survey\Repositories\SurveyRepositoryInterface;
use App\Domain\Survey\ValueObjects\SurveyDate;
use App\Domain\Survey\ValueObjects\SurveyId;
use App\Domain\Survey\ValueObjects\SurveyResult;
use App\Domain\User\ValueObjects\UserId;
use App\Models\Survey as EloquentSurvey;
use Carbon\Carbon;

final class EloquentSurveyRepository implements SurveyRepositoryInterface
{
    public function findById(SurveyId $id): ?DomainSurvey
    {
        $eloquent = EloquentSurvey::find($id->getValue());

        return $eloquent ? $this->toDomainEntity($eloquent) : null;
    }

    public function findAll(): array
    {
        return EloquentSurvey::all()
            ->map(fn ($e) => $this->toDomainEntity($e))
            ->toArray();
    }

    public function findByUserId(UserId $userId): array
    {
        return EloquentSurvey::where('user_id', $userId->getValue())->get()
            ->map(fn ($e) => $this->toDomainEntity($e))
            ->toArray();
    }

    public function findByFollowUpFileId(FollowUpFileId $followUpFileId): array
    {
        return EloquentSurvey::where('follow_up_file_id', $followUpFileId->getValue())->get()
            ->map(fn ($e) => $this->toDomainEntity($e))
            ->toArray();
    }

    public function save(DomainSurvey $survey): DomainSurvey
    {
        $eloquent = $survey->getSurveyId()
            ? EloquentSurvey::find($survey->getSurveyId()->getValue())
            : new EloquentSurvey;

        if (! $eloquent) {
            $eloquent = new EloquentSurvey;
        }

        $eloquent->date = $survey->getDate()->getValue()?->toDateString();
        $eloquent->result = $survey->getResult()->getValue();
        $eloquent->user_id = $survey->getUserId()->getValue();
        $eloquent->follow_up_file_id = $survey->getFollowUpFileId()->getValue();
        $eloquent->save();

        return $this->toDomainEntity($eloquent);
    }

    public function delete(SurveyId $id): bool
    {
        return EloquentSurvey::destroy($id->getValue()) > 0;
    }

    private function toDomainEntity(EloquentSurvey $e): DomainSurvey
    {
        $normalizedResult = $this->normalizeResult($e->result);
        return new DomainSurvey(
            surveyId: new SurveyId($e->survey_id),
            date: new SurveyDate($e->date ? Carbon::parse($e->date) : null),
            result: new SurveyResult($normalizedResult),
            userId: new UserId($e->user_id),
            followUpFileId: new FollowUpFileId($e->follow_up_file_id),
            createdAt: $e->created_at,
            updatedAt: $e->updated_at,
        );
    }

    /**
     * Coerce arbitrary DB values into allowed SurveyResult enum values.
     */
    private function normalizeResult(mixed $value): string
    {
        if ($value === null) {
            return 'PENDING';
        }

        // Handle booleans and numeric-like values
        if (is_bool($value)) {
            return $value ? 'PASSED' : 'FAILED';
        }
        if (is_int($value)) {
            return $value === 1 ? 'PASSED' : ($value === 0 ? 'FAILED' : 'PENDING');
        }

        $str = strtoupper(trim((string) $value));
        if ($str === '') {
            return 'PENDING';
        }

        // Direct allowed values
        if (in_array($str, SurveyResult::ALLOWED, true)) {
            return $str;
        }

        // Common synonyms mapping
        // Passed
        if (str_contains($str, 'PASS') || in_array($str, ['OK', 'VALID', 'APPROVED', 'APPROUVE', 'APPROUVÉ', 'SUCCESS', 'SUCCEEDED'], true)) {
            return 'PASSED';
        }
        // Failed
        if (str_contains($str, 'FAIL') || in_array($str, ['REJECT', 'REJECTED', 'KO', 'ERROR'], true)) {
            return 'FAILED';
        }
        // Pending-like
        if (in_array($str, ['PEND', 'PENDING', 'WAIT', 'WAITING', 'IN_PROGRESS', 'DRAFT'], true)) {
            return 'PENDING';
        }

        // Fallback to PENDING to keep domain invariant stable
        return 'PENDING';
    }
}
