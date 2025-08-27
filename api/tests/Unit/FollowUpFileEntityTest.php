<?php

use App\Domain\FollowUpFile\Entities\FollowUpFile;
use App\Domain\FollowUpFile\ValueObjects\BillOfLading;
use App\Domain\FollowUpFile\ValueObjects\FollowUpFileId;
use App\Domain\FollowUpFile\ValueObjects\FollowUpStatus;
use App\Domain\PortCall\ValueObjects\PortCallId;
use App\Domain\Vehicle\ValueObjects\VehicleId;
use Carbon\Carbon;

it('creates entity and exposes data', function () {
    $entity = new FollowUpFile(
        followUpFileId: new FollowUpFileId(10),
        billOfLading: new BillOfLading('bol-001'),
        status: new FollowUpStatus('OPEN'),
        vehicleId: new VehicleId(2),
        portCallId: new PortCallId(3),
        createdAt: Carbon::parse('2025-08-01 10:00:00'),
        updatedAt: Carbon::parse('2025-08-02 11:00:00'),
    );

    expect($entity->getFollowUpFileId()->getValue())->toBe(10)
        ->and($entity->getBillOfLading()->getValue())->toBe('BOL-001')
        ->and($entity->getStatus()->getValue())->toBe('OPEN')
        ->and($entity->getVehicleId()->getValue())->toBe(2)
        ->and($entity->getPortCallId()->getValue())->toBe(3);

    $arr = $entity->toArray();
    expect($arr['follow_up_file_id'])->toBe(10)
        ->and($arr['bill_of_lading'])->toBe('BOL-001')
        ->and($arr['status'])->toBe('OPEN')
        ->and($arr['vehicle_id'])->toBe(2)
        ->and($arr['port_call_id'])->toBe(3)
        ->and($arr['created_at'])->toBeString()
        ->and($arr['updated_at'])->toBeString();
});
