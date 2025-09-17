<?php

use App\Domain\Inspection\Entities\Inspection;
use App\Domain\Inspection\Entities\InspectionCheckpoint;
use App\Domain\Inspection\ValueObjects\CheckpointId;
use App\Domain\Inspection\ValueObjects\CheckpointStatus;
use App\Domain\Inspection\ValueObjects\InspectionId;
use App\Domain\Inspection\ValueObjects\InspectionStatus;
use App\Infrastructure\Persistence\Repositories\InspectionRepository;
use App\Models\Survey;
use App\Models\SurveyCheckpoint;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;

uses(RefreshDatabase::class);

beforeEach(function () {
    // no-op; resolved per test to avoid stale state
});

it('finds inspection by id', function () {
    $survey = Survey::factory()->create([
        'survey_name' => 'Test Inspection',
        'survey_description' => 'Test Description',
        'overall_status' => 'IN_PROGRESS',
    ]);

    $checkpoint = SurveyCheckpoint::factory()->create([
        'survey_id' => $survey->survey_id,
        'title_checkpoint' => 'Test Checkpoint',
        'description_checkpoint' => 'Test Description',
        'order_checkpoint' => 1,
        'result_checkpoint' => 'ok',
        'comment_checkpoint' => 'Test comment',
        'photos' => json_encode(['photo1.jpg']),
    ]);

    $repository = new InspectionRepository;
    $inspection = $repository->findById(new InspectionId($survey->survey_id));

    expect($inspection)->toBeInstanceOf(Inspection::class);
    expect($inspection->getSurveyName())->toBe('Test Inspection');
    expect($inspection->getSurveyDescription())->toBe('Test Description');
    expect($inspection->getOverallStatus())->toBe(InspectionStatus::IN_PROGRESS);
    expect($inspection->getCheckpoints())->toHaveCount(1);

    $checkpointEntity = $inspection->getCheckpoints()[0];
    expect($checkpointEntity->getTitle())->toBe('Test Checkpoint');
    expect($checkpointEntity->getStatus())->toBe(CheckpointStatus::OK);
    expect($checkpointEntity->getComment())->toBe('Test comment');
    expect($checkpointEntity->getPhotos())->toContain('photo1.jpg');
});

it('returns null when inspection not found', function () {
    $repository = new InspectionRepository;
    $inspection = $repository->findById(new InspectionId(999));

    expect($inspection)->toBeNull();
});

it('finds inspections by discharge id', function () {
    $d1 = \App\Models\Discharge::factory()->create();
    $d2 = \App\Models\Discharge::factory()->create();

    $survey1 = Survey::factory()->create(['discharge_id' => $d1->discharge_id]);
    $survey2 = Survey::factory()->create(['discharge_id' => $d1->discharge_id]);
    $survey3 = Survey::factory()->create(['discharge_id' => $d2->discharge_id]);

    $repository = new InspectionRepository;
    $inspections = $repository->findByDischargeId($d1->discharge_id);

    expect($inspections)->toHaveCount(2);
    expect($inspections[0])->toBeInstanceOf(Inspection::class);
    expect($inspections[1])->toBeInstanceOf(Inspection::class);
});

it('saves inspection', function () {
    $inspection = new Inspection(
        inspectionId: null,
        surveyName: 'New Inspection',
        surveyDescription: 'New Description',
        overallStatus: InspectionStatus::PENDING
    );

    $repository = new InspectionRepository;
    $savedInspection = $repository->save($inspection);

    expect($savedInspection)->toBeInstanceOf(Inspection::class);
    expect($savedInspection->getSurveyName())->toBe('New Inspection');
    expect($savedInspection->getInspectionId())->not->toBeNull();

    $row = DB::table('surveys')->where([
        'survey_name' => 'New Inspection',
        'survey_description' => 'New Description',
        'overall_status' => 'PENDING',
    ])->first();
    expect($row)->not->toBeNull();
});

it('finds checkpoint by id', function () {
    $survey = Survey::factory()->create();
    $checkpoint = SurveyCheckpoint::factory()->create([
        'survey_id' => $survey->survey_id,
        'title_checkpoint' => 'Test Checkpoint',
        'description_checkpoint' => 'Test Description',
        'order_checkpoint' => 1,
        'result_checkpoint' => 'ok',
        'comment_checkpoint' => 'Test comment',
        'photos' => json_encode(['photo1.jpg', 'photo2.jpg']),
    ]);

    $repository = new InspectionRepository;
    $checkpointEntity = $repository->findCheckpointById(new CheckpointId($checkpoint->checkpoint_id));

    expect($checkpointEntity)->toBeInstanceOf(InspectionCheckpoint::class);
    expect($checkpointEntity->getTitle())->toBe('Test Checkpoint');
    expect($checkpointEntity->getDescription())->toBe('Test Description');
    expect($checkpointEntity->getOrder())->toBe(1);
    expect($checkpointEntity->getStatus())->toBe(CheckpointStatus::OK);
    expect($checkpointEntity->getComment())->toBe('Test comment');
    expect($checkpointEntity->getPhotos())->toHaveCount(2);
    expect($checkpointEntity->getPhotos())->toContain('photo1.jpg');
    expect($checkpointEntity->getPhotos())->toContain('photo2.jpg');
});

it('returns null when checkpoint not found', function () {
    $repository = new InspectionRepository;
    $checkpoint = $repository->findCheckpointById(new CheckpointId(999));

    expect($checkpoint)->toBeNull();
});

it('saves checkpoint', function () {
    $checkpoint = new InspectionCheckpoint(
        checkpointId: new CheckpointId(0), // New checkpoint
        title: 'New Checkpoint',
        description: 'New Description',
        order: 1,
        status: CheckpointStatus::PENDING,
        comment: 'New comment',
        photos: ['photo1.jpg']
    );

    $repository = new InspectionRepository;
    $savedCheckpoint = $repository->saveCheckpoint($checkpoint);

    expect($savedCheckpoint)->toBeInstanceOf(InspectionCheckpoint::class);
    expect($savedCheckpoint->getTitle())->toBe('New Checkpoint');
    expect($savedCheckpoint->getCheckpointId()->getValue())->not->toBe(0);

    $row = DB::table('survey_checkpoints')->where([
        'title_checkpoint' => 'New Checkpoint',
        'description_checkpoint' => 'New Description',
        'order_checkpoint' => 1,
        'result_checkpoint' => 'pending',
        'comment_checkpoint' => 'New comment',
    ])->first();
    expect($row)->not->toBeNull();
});

it('updates existing checkpoint', function () {
    $survey = Survey::factory()->create();
    $checkpoint = SurveyCheckpoint::factory()->create([
        'survey_id' => $survey->survey_id,
        'title_checkpoint' => 'Original Title',
        'result_checkpoint' => 'pending',
    ]);

    $checkpointEntity = new InspectionCheckpoint(
        checkpointId: new CheckpointId($checkpoint->checkpoint_id),
        title: 'Updated Title',
        description: 'Updated Description',
        order: 2,
        status: CheckpointStatus::OK,
        comment: 'Updated comment',
        photos: ['updated_photo.jpg']
    );

    $repository = new InspectionRepository;
    $savedCheckpoint = $repository->saveCheckpoint($checkpointEntity);

    expect($savedCheckpoint->getTitle())->toBe('Updated Title');
    expect($savedCheckpoint->getStatus())->toBe(CheckpointStatus::OK);

    $row = DB::table('survey_checkpoints')->where([
        'checkpoint_id' => $checkpoint->checkpoint_id,
        'title_checkpoint' => 'Updated Title',
        'description_checkpoint' => 'Updated Description',
        'order_checkpoint' => 2,
        'result_checkpoint' => 'ok',
        'comment_checkpoint' => 'Updated comment',
    ])->first();
    expect($row)->not->toBeNull();
});
