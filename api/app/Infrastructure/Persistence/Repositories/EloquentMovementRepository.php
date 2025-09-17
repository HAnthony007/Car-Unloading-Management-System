<?php

namespace App\Infrastructure\Persistence\Repositories;

use App\Domain\Discharge\ValueObjects\DischargeId;
use App\Domain\Movement\Entities\Movement as DomainMovement;
use App\Domain\Movement\Repositories\MovementRepositoryInterface;
use App\Domain\Movement\ValueObjects\MovementId;
use App\Domain\Movement\ValueObjects\VehicleLocation;
use App\Domain\User\ValueObjects\UserId;
use App\Models\Movement as EloquentMovement;
use Carbon\Carbon;

final class EloquentMovementRepository implements MovementRepositoryInterface
{
    public function findById(MovementId $id): ?DomainMovement
    {
        $e = EloquentMovement::find($id->getValue());

        return $e ? $this->toDomain($e) : null;
    }

    public function findByDischarge(DischargeId $dischargeId): array
    {
        return EloquentMovement::where('discharge_id', $dischargeId->getValue())
            ->orderByDesc('timestamp')
            ->get()
            ->map(fn ($e) => $this->toDomain($e))
            ->toArray();
    }

    public function findByUser(UserId $userId): array
    {
        return EloquentMovement::where('user_id', $userId->getValue())
            ->orderByDesc('timestamp')
            ->get()
            ->map(fn ($e) => $this->toDomain($e))
            ->toArray();
    }

    public function findAll(): array
    {
        return EloquentMovement::orderByDesc('timestamp')
            ->get()
            ->map(fn ($e) => $this->toDomain($e))
            ->toArray();
    }

    public function save(DomainMovement $movement): DomainMovement
    {
        $e = $movement->getMovementId() ? EloquentMovement::find($movement->getMovementId()->getValue()) : new EloquentMovement;
        if (! $e) {
            $e = new EloquentMovement;
        }

        $e->note = $movement->getNote();
        $e->timestamp = $movement->getTimestamp();
        $e->from = $movement->getFrom()->getValue();
        $e->to = $movement->getTo()->getValue();
        $e->discharge_id = $movement->getDischargeId()->getValue();
        $e->user_id = $movement->getUserId()->getValue();
        $e->parking_number = $movement->getParkingNumber();
        $e->from_latitude = $movement->getFromLatitude();
        $e->from_longitude = $movement->getFromLongitude();
        $e->to_latitude = $movement->getToLatitude();
        $e->to_longitude = $movement->getToLongitude();
        $e->save();

        return $this->toDomain($e);
    }

    public function delete(MovementId $id): bool
    {
        $e = EloquentMovement::find($id->getValue());
        if (! $e) {
            return false;
        }

        return (bool) $e->delete();
    }

    public function search(?int $dischargeId, ?int $userId, ?string $from, ?string $to, ?string $note, int $page, int $perPage): array
    {
        $query = EloquentMovement::query();

        if ($dischargeId) {
            $query->where('discharge_id', $dischargeId);
        }
        if ($userId) {
            $query->where('user_id', $userId);
        }
        if ($from) {
            $query->where('from', 'like', '%'.$from.'%');
        }
        if ($to) {
            $query->where('to', 'like', '%'.$to.'%');
        }
        if ($note) {
            $query->where('note', 'like', '%'.$note.'%');
        }

        $paginator = $query->orderByDesc('timestamp')->paginate($perPage, ['*'], 'page', $page);

        $data = collect($paginator->items())->map(fn ($e) => $this->toDomain($e))->toArray();

        return [
            'data' => $data,
            'current_page' => $paginator->currentPage(),
            'from' => $paginator->firstItem() ?? 0,
            'last_page' => $paginator->lastPage(),
            'path' => request()->url(),
            'per_page' => $paginator->perPage(),
            'to' => $paginator->lastItem() ?? 0,
            'total' => $paginator->total(),
        ];
    }

    public function findDischargeIdsAtLocation(string $locationName): array
    {
        // Subquery to get latest movement timestamp per discharge
        $sub = EloquentMovement::selectRaw('discharge_id, MAX(timestamp) as latest_ts')
            ->groupBy('discharge_id');

        // Join to get the row(s) representing the latest movement per discharge
        $rows = EloquentMovement::joinSub($sub, 'latest', function ($join) {
            $join->on('movements.discharge_id', '=', 'latest.discharge_id')
                ->on('movements.timestamp', '=', 'latest.latest_ts');
        })
            ->where('movements.to', $locationName)
            ->distinct()
            ->pluck('movements.discharge_id')
            ->all();

        return array_map('intval', $rows);
    }

    public function findLatestParkingNumbersForDischargesAtLocation(string $locationName): array
    {
        $sub = EloquentMovement::selectRaw('discharge_id, MAX(timestamp) as latest_ts')
            ->groupBy('discharge_id');

        // Map discharge_id => parking_number for latest movement at location
        $rows = EloquentMovement::joinSub($sub, 'latest', function ($join) {
            $join->on('movements.discharge_id', '=', 'latest.discharge_id')
                ->on('movements.timestamp', '=', 'latest.latest_ts');
        })
            ->where('movements.to', $locationName)
            ->get(['movements.discharge_id', 'movements.parking_number']);

        $map = [];
        foreach ($rows as $row) {
            $map[(int) $row->discharge_id] = $row->parking_number; // may be null
        }

        return $map;
    }

    private function toDomain(EloquentMovement $e): DomainMovement
    {
        return new DomainMovement(
            movementId: new MovementId($e->movement_id),
            note: $e->note,
            timestamp: Carbon::parse($e->timestamp),
            from: new VehicleLocation($e->from),
            to: new VehicleLocation($e->to),
            dischargeId: new DischargeId($e->discharge_id),
            userId: new UserId($e->user_id),
            parkingNumber: $e->parking_number,
            fromLatitude: $e->from_latitude,
            fromLongitude: $e->from_longitude,
            toLatitude: $e->to_latitude,
            toLongitude: $e->to_longitude,
            createdAt: $e->created_at,
            updatedAt: $e->updated_at,
        );
    }
}
