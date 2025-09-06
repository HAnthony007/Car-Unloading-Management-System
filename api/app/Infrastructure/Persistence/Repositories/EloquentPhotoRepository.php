<?php

namespace App\Infrastructure\Persistence\Repositories;

use App\Domain\Discharge\ValueObjects\DischargeId;
use App\Domain\Photo\Entities\Photo as DomainPhoto;
use App\Domain\Photo\Repositories\PhotoRepositoryInterface;
use App\Domain\Photo\ValueObjects\PhotoId;
use App\Domain\Survey\ValueObjects\SurveyId;
use App\Domain\SurveyCheckpoint\ValueObjects\SurveyCheckpointId;
use App\Models\Photo as EloquentPhoto;
use Carbon\Carbon;

final class EloquentPhotoRepository implements PhotoRepositoryInterface
{
    public function findById(PhotoId $id): ?DomainPhoto
    {
        $e = EloquentPhoto::find($id->getValue());

        return $e ? $this->toDomain($e) : null;
    }

    public function findAll(): array
    {
        return EloquentPhoto::orderByDesc('taken_at')
            ->get()
            ->map(fn ($e) => $this->toDomain($e))
            ->toArray();
    }

    public function save(DomainPhoto $p): DomainPhoto
    {
        $e = $p->getPhotoId() ? EloquentPhoto::find($p->getPhotoId()->getValue()) : new EloquentPhoto;
        if (! $e) {
            $e = new EloquentPhoto;
        }

        $e->photo_path = $p->getPhotoPath();
        $e->taken_at = $p->getTakenAt();
        $e->photo_description = $p->getPhotoDescription();
        $e->discharge_id = $p->getDischargeId()->getValue();
        $e->survey_id = $p->getSurveyId()?->getValue();
        $e->checkpoint_id = $p->getCheckpointId()?->getValue();
        $e->save();

        return $this->toDomain($e);
    }

    public function delete(PhotoId $id): bool
    {
        $e = EloquentPhoto::find($id->getValue());
        if (! $e) {
            return false;
        }

        return (bool) $e->delete();
    }

    public function search(?int $dischargeId, ?int $surveyId, ?int $checkpointId, ?string $fromDate, ?string $toDate, int $page, int $perPage): array
    {
        $query = EloquentPhoto::query();
        if ($dischargeId) {
            $query->where('discharge_id', $dischargeId);
        }
        if ($surveyId) {
            $query->where('survey_id', $surveyId);
        }
        if ($checkpointId) {
            $query->where('checkpoint_id', $checkpointId);
        }
        if ($fromDate) {
            $query->where('taken_at', '>=', Carbon::parse($fromDate));
        }
        if ($toDate) {
            $query->where('taken_at', '<=', Carbon::parse($toDate));
        }

        $paginator = $query->orderByDesc('taken_at')->paginate($perPage, ['*'], 'page', $page);

        return [
            'data' => collect($paginator->items())->map(fn ($e) => $this->toDomain($e))->toArray(),
            'current_page' => $paginator->currentPage(),
            'from' => $paginator->firstItem() ?? 0,
            'last_page' => $paginator->lastPage(),
            'path' => $paginator->path(),
            'per_page' => $paginator->perPage(),
            'to' => $paginator->lastItem() ?? 0,
            'total' => $paginator->total(),
        ];
    }

    private function toDomain(EloquentPhoto $e): DomainPhoto
    {
        return new DomainPhoto(
            photoId: new PhotoId($e->photo_id),
            photoPath: $e->photo_path,
            takenAt: new Carbon($e->taken_at),
            photoDescription: $e->photo_description,
            dischargeId: new DischargeId($e->discharge_id),
            surveyId: $e->survey_id ? new SurveyId($e->survey_id) : null,
            checkpointId: $e->checkpoint_id ? new SurveyCheckpointId($e->checkpoint_id) : null,
            createdAt: $e->created_at,
            updatedAt: $e->updated_at,
        );
    }
}
