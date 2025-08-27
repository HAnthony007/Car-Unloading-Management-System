<?php

use App\Domain\FollowUpFile\ValueObjects\FollowUpFileId;
use App\Domain\Photo\Entities\Photo;
use App\Domain\Photo\ValueObjects\PhotoId;
use App\Domain\SurveyCheckpoint\ValueObjects\SurveyCheckpointId;
use App\Domain\Vehicle\ValueObjects\VehicleId;
use Carbon\Carbon;

it('creates Photo entity and exposes data', function () {
    $photo = new Photo(
        photoId: new PhotoId(5),
        photoPath: 'images/abc.jpg',
        takenAt: Carbon::parse('2025-08-01 10:00:00'),
        photoDescription: 'Front view',
        followUpFileId: new FollowUpFileId(2),
        vehicleId: new VehicleId(3),
        checkpointId: new SurveyCheckpointId(4),
        createdAt: Carbon::parse('2025-08-01 10:00:00'),
        updatedAt: Carbon::parse('2025-08-02 11:00:00'),
    );

    expect($photo->getPhotoId()?->getValue())->toBe(5)
        ->and($photo->getPhotoPath())->toBe('images/abc.jpg')
        ->and($photo->getTakenAt()->toDateTimeString())->toBe('2025-08-01 10:00:00')
        ->and($photo->getPhotoDescription())->toBe('Front view')
        ->and($photo->getFollowUpFileId()->getValue())->toBe(2)
        ->and($photo->getVehicleId()->getValue())->toBe(3)
        ->and($photo->getCheckpointId()->getValue())->toBe(4);

    $arr = $photo->toArray();
    expect($arr['photo_id'])->toBe(5)
        ->and($arr['photo_path'])->toBe('images/abc.jpg')
        ->and($arr['taken_at'])->toBeString()
        ->and($arr['photo_description'])->toBe('Front view')
        ->and($arr['follow_up_file_id'])->toBe(2)
        ->and($arr['vehicle_id'])->toBe(3)
        ->and($arr['checkpoint_id'])->toBe(4)
        ->and($arr['created_at'])->toBeString()
        ->and($arr['updated_at'])->toBeString();
});
