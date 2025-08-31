<?php

namespace App\Infrastructure\Persistence\Repositories;

use App\Domain\Movement\Entities\Movement as DomainMovement;
use App\Domain\Movement\Repositories\MovementRepositoryInterface;
use App\Domain\Movement\ValueObjects\MovementId;
use App\Domain\Movement\ValueObjects\VehicleLocation;
use App\Domain\User\ValueObjects\UserId;
use App\Domain\Vehicle\ValueObjects\VehicleId;
use App\Models\Movement as EloquentMovement;
use Carbon\Carbon;

final class EloquentMovementRepository implements MovementRepositoryInterface
{
    public function findById(MovementId $id): ?DomainMovement
    {
        $e = EloquentMovement::find($id->getValue());

        return $e ? $this->toDomain($e) : null;
    }

    public function findByVehicle(VehicleId $vehicleId): array
    {
        return EloquentMovement::where('vehicle_id', $vehicleId->getValue())
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
        $e->vehicle_id = $movement->getVehicleId()->getValue();
        $e->user_id = $movement->getUserId()->getValue();
        $e->parking_number = $movement->getParkingNumber();
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

    public function search(?int $vehicleId, ?int $userId, ?string $from, ?string $to, ?string $note, int $page, int $perPage): array
    {
        $query = EloquentMovement::query();

        if ($vehicleId) {
            $query->where('vehicle_id', $vehicleId);
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

    public function findVehicleIdsAtLocation(string $locationName): array
    {
        // Subquery to get latest movement timestamp per vehicle
        $sub = EloquentMovement::selectRaw('vehicle_id, MAX(timestamp) as latest_ts')
            ->groupBy('vehicle_id');

        // Join to get the row(s) representing the latest movement per vehicle
        $rows = EloquentMovement::joinSub($sub, 'latest', function ($join) {
            $join->on('movements.vehicle_id', '=', 'latest.vehicle_id')
                ->on('movements.timestamp', '=', 'latest.latest_ts');
        })
            ->where('movements.to', $locationName)
            ->distinct()
            ->pluck('movements.vehicle_id')
            ->all();

        return array_map('intval', $rows);
    }

    public function findLatestParkingNumbersForVehiclesAtLocation(string $locationName): array
    {
        $sub = EloquentMovement::selectRaw('vehicle_id, MAX(timestamp) as latest_ts')
            ->groupBy('vehicle_id');

        // Map vehicle_id => parking_number for latest movement at location
        $rows = EloquentMovement::joinSub($sub, 'latest', function ($join) {
            $join->on('movements.vehicle_id', '=', 'latest.vehicle_id')
                ->on('movements.timestamp', '=', 'latest.latest_ts');
        })
            ->where('movements.to', $locationName)
            ->get(['movements.vehicle_id', 'movements.parking_number']);

        $map = [];
        foreach ($rows as $row) {
            $map[(int) $row->vehicle_id] = $row->parking_number; // may be null
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
            vehicleId: new VehicleId($e->vehicle_id),
            userId: new UserId($e->user_id),
            parkingNumber: $e->parking_number,
            createdAt: $e->created_at,
            updatedAt: $e->updated_at,
        );
    }
}
