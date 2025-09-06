<?php

use App\Domain\Discharge\ValueObjects\DischargeId;
use App\Domain\Photo\Entities\Photo;
use App\Domain\Photo\ValueObjects\PhotoId;
use App\Domain\Survey\ValueObjects\SurveyId;
use App\Domain\SurveyCheckpoint\ValueObjects\SurveyCheckpointId;
use Carbon\Carbon;

it('creates Photo entity and exposes data', function () {
    $photo = new Photo(
        photoId: new PhotoId(5),
        photoPath: 'images/abc.jpg',
        takenAt: Carbon::parse('2025-08-01 10:00:00'),
        photoDescription: 'Front view',
        dischargeId: new DischargeId(2),
        surveyId: new SurveyId(7),
        checkpointId: new SurveyCheckpointId(4),
        createdAt: Carbon::parse('2025-08-01 10:00:00'),
        updatedAt: Carbon::parse('2025-08-02 11:00:00'),
    );

    expect($photo->getPhotoId()?->getValue())->toBe(5)
        ->and($photo->getPhotoPath())->toBe('images/abc.jpg')
        ->and($photo->getTakenAt()->toDateTimeString())->toBe('2025-08-01 10:00:00')
        ->and($photo->getPhotoDescription())->toBe('Front view')
        ->and($photo->getDischargeId()->getValue())->toBe(2)
        ->and($photo->getSurveyId()?->getValue())->toBe(7)
        ->and($photo->getCheckpointId()->getValue())->toBe(4);

    $arr = $photo->toArray();
    expect($arr['photo_id'])->toBe(5)
        ->and($arr['photo_path'])->toBe('images/abc.jpg')
        ->and($arr['taken_at'])->toBeString()
        ->and($arr['photo_description'])->toBe('Front view')
        ->and($arr['discharge_id'])->toBe(2)
        ->and($arr['survey_id'])->toBe(7)
        ->and($arr['checkpoint_id'])->toBe(4)
        ->and($arr['created_at'])->toBeString()
        ->and($arr['updated_at'])->toBeString();
});
