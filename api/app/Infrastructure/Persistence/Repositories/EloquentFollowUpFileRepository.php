<?php

namespace App\Infrastructure\Persistence\Repositories;

use App\Domain\FollowUpFile\Entities\FollowUpFile as DomainFollowUpFile;
use App\Domain\FollowUpFile\Repositories\FollowUpFileRepositoryInterface;
use App\Domain\FollowUpFile\ValueObjects\BillOfLading;
use App\Domain\FollowUpFile\ValueObjects\FollowUpFileId;
use App\Domain\FollowUpFile\ValueObjects\FollowUpStatus;
use App\Domain\PortCall\ValueObjects\PortCallId;
use App\Domain\Vehicle\ValueObjects\VehicleId;
use App\Models\FollowUpFile as EloquentFollowUpFile;

final class EloquentFollowUpFileRepository implements FollowUpFileRepositoryInterface
{
    public function findById(FollowUpFileId $id): ?DomainFollowUpFile
    {
        $e = EloquentFollowUpFile::find($id->getValue());

        return $e ? $this->toDomain($e) : null;
    }

    public function findByBillOfLading(BillOfLading $bol): ?DomainFollowUpFile
    {
        $e = EloquentFollowUpFile::where('bill_of_lading', $bol->getValue())->first();

        return $e ? $this->toDomain($e) : null;
    }

    public function findAll(): array
    {
        return EloquentFollowUpFile::orderByDesc('created_at')
            ->get()
            ->map(fn ($e) => $this->toDomain($e))
            ->toArray();
    }

    public function save(DomainFollowUpFile $fuf): DomainFollowUpFile
    {
        $e = $fuf->getFollowUpFileId() ? EloquentFollowUpFile::find($fuf->getFollowUpFileId()->getValue()) : new EloquentFollowUpFile;
        if (! $e) {
            $e = new EloquentFollowUpFile;
        }

        $e->bill_of_lading = $fuf->getBillOfLading()->getValue();
        $e->status = $fuf->getStatus()->getValue();
        $e->vehicle_id = $fuf->getVehicleId()->getValue();
        $e->port_call_id = $fuf->getPortCallId()->getValue();
        $e->save();

        return $this->toDomain($e);
    }

    public function delete(FollowUpFileId $id): bool
    {
        $e = EloquentFollowUpFile::find($id->getValue());
        if (! $e) {
            return false;
        }

        return (bool) $e->delete();
    }

    private function toDomain(EloquentFollowUpFile $e): DomainFollowUpFile
    {
        return new DomainFollowUpFile(
            followUpFileId: new FollowUpFileId($e->follow_up_file_id),
            billOfLading: new BillOfLading($e->bill_of_lading),
            status: new FollowUpStatus($e->status),
            vehicleId: new VehicleId($e->vehicle_id),
            portCallId: new PortCallId($e->port_call_id),
            createdAt: $e->created_at,
            updatedAt: $e->updated_at,
        );
    }
}
