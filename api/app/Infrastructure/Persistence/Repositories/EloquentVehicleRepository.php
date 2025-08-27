<?php

namespace App\Infrastructure\Persistence\Repositories;

use App\Domain\Discharge\ValueObjects\DischargeId;
use App\Domain\Vehicle\Entities\Vehicle as DomainVehicle;
use App\Domain\Vehicle\Repositories\VehicleRepositoryInterface;
use App\Domain\Vehicle\ValueObjects\VehicleId;
use App\Domain\Vehicle\ValueObjects\Vin;
use App\Models\Vehicle as EloquentVehicle;

final class EloquentVehicleRepository implements VehicleRepositoryInterface
{
    public function findById(VehicleId $vehicleId): ?DomainVehicle
    {
        $e = EloquentVehicle::find($vehicleId->getValue());
        return $e ? $this->toDomainEntity($e) : null;
    }

    public function findByVin(Vin $vin): ?DomainVehicle
    {
        $e = EloquentVehicle::where('vin', $vin->getValue())->first();
        return $e ? $this->toDomainEntity($e) : null;
    }

    public function findAll(): array
    {
        return EloquentVehicle::all()->map(fn ($e) => $this->toDomainEntity($e))->toArray();
    }

    public function save(DomainVehicle $vehicle): DomainVehicle
    {
        $e = $vehicle->getVehicleId() ? EloquentVehicle::find($vehicle->getVehicleId()->getValue()) : new EloquentVehicle();
        if (!$e) {
            $e = new EloquentVehicle();
        }

        $e->vin = $vehicle->getVin()->getValue();
        $e->make = $vehicle->getMake();
        $e->model = $vehicle->getModel();
        $e->color = $vehicle->getColor();
        $e->type = $vehicle->getType();
        $e->weight = $vehicle->getWeight();
        $e->vehicle_condition = $vehicle->getVehicleCondition();
        $e->vehicle_observation = $vehicle->getVehicleObservation();
        $e->origin_country = $vehicle->getOriginCountry();
        $e->ship_location = $vehicle->getShipLocation();
        $e->is_primed = $vehicle->isPrimed();
        $e->discharge_id = $vehicle->getDischargeId()->getValue();
        $e->save();

        return $this->toDomainEntity($e);
    }

    public function delete(VehicleId $vehicleId): bool
    {
        $e = EloquentVehicle::find($vehicleId->getValue());
        if (!$e) {
            return false;
        }
        return (bool)$e->delete();
    }

    private function toDomainEntity(EloquentVehicle $e): DomainVehicle
    {
        return new DomainVehicle(
            vehicleId: new VehicleId($e->vehicle_id),
            vin: new Vin($e->vin),
            make: $e->make,
            model: $e->model,
            color: $e->color,
            type: $e->type,
            weight: $e->weight,
            vehicleCondition: $e->vehicle_condition,
            vehicleObservation: $e->vehicle_observation,
            originCountry: $e->origin_country,
            shipLocation: $e->ship_location,
            isPrimed: (bool)$e->is_primed,
            dischargeId: new DischargeId($e->discharge_id),
            createdAt: $e->created_at,
            updatedAt: $e->updated_at,
        );
    }

    public function search(?string $vin, ?int $dischargeId, ?string $make, ?string $model, int $page, int $perPage): array
    {
        $query = EloquentVehicle::query();

        if ($vin) {
            $query->where('vin', 'like', '%' . strtoupper($vin) . '%');
        }
        if ($dischargeId) {
            $query->where('discharge_id', $dischargeId);
        }
        if ($make) {
            $query->where('make', 'like', '%' . $make . '%');
        }
        if ($model) {
            $query->where('model', 'like', '%' . $model . '%');
        }

        $paginator = $query->orderByDesc('created_at')->paginate($perPage, ['*'], 'page', $page);

        $data = collect($paginator->items())->map(fn($e) => $this->toDomainEntity($e))->toArray();

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
}
