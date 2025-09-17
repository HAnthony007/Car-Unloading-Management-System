<?php

use App\Domain\Inspection\Entities\Inspection;
use App\Domain\Inspection\Entities\InspectionCheckpoint;
use App\Domain\Inspection\ValueObjects\CheckpointId;
use App\Domain\Inspection\ValueObjects\CheckpointStatus;
use App\Domain\Inspection\ValueObjects\InspectionId;
use App\Domain\Inspection\ValueObjects\InspectionStatus;
use Carbon\Carbon;

it('creates inspection with default values', function () {
    $inspection = new Inspection(
        inspectionId: new InspectionId(1),
        surveyName: 'Test Inspection',
        surveyDescription: 'Test Description'
    );

    expect($inspection->getInspectionId()->getValue())->toBe(1);
    expect($inspection->getSurveyName())->toBe('Test Inspection');
    expect($inspection->getSurveyDescription())->toBe('Test Description');
    expect($inspection->getOverallStatus())->toBe(InspectionStatus::PENDING);
    expect($inspection->getCheckpoints())->toBeEmpty();
});

it('creates inspection with custom values', function () {
    $checkpoint1 = new InspectionCheckpoint(
        checkpointId: new CheckpointId(1),
        title: 'Checkpoint 1',
        description: 'Description 1',
        order: 1,
        status: CheckpointStatus::OK
    );

    $checkpoint2 = new InspectionCheckpoint(
        checkpointId: new CheckpointId(2),
        title: 'Checkpoint 2',
        description: 'Description 2',
        order: 2,
        status: CheckpointStatus::DEFECT
    );

    $inspection = new Inspection(
        inspectionId: new InspectionId(1),
        surveyName: 'Test Inspection',
        surveyDescription: 'Test Description',
        overallStatus: InspectionStatus::IN_PROGRESS,
        checkpoints: [$checkpoint1, $checkpoint2]
    );

    expect($inspection->getOverallStatus())->toBe(InspectionStatus::IN_PROGRESS);
    expect($inspection->getCheckpoints())->toHaveCount(2);
    expect($inspection->getCheckpoints()[0])->toBe($checkpoint1);
    expect($inspection->getCheckpoints()[1])->toBe($checkpoint2);
});

it('updates inspection status', function () {
    $inspection = new Inspection(
        inspectionId: new InspectionId(1),
        surveyName: 'Test Inspection',
        surveyDescription: 'Test Description',
        overallStatus: InspectionStatus::PENDING
    );

    $inspection->updateStatus(InspectionStatus::COMPLETED);

    expect($inspection->getOverallStatus())->toBe(InspectionStatus::COMPLETED);
});

it('adds checkpoint to inspection', function () {
    $inspection = new Inspection(
        inspectionId: new InspectionId(1),
        surveyName: 'Test Inspection',
        surveyDescription: 'Test Description'
    );

    $checkpoint = new InspectionCheckpoint(
        checkpointId: new CheckpointId(1),
        title: 'New Checkpoint',
        description: 'New Description',
        order: 1
    );

    $inspection->addCheckpoint($checkpoint);

    expect($inspection->getCheckpoints())->toHaveCount(1);
    expect($inspection->getCheckpoints()[0])->toBe($checkpoint);
});

it('updates existing checkpoint', function () {
    $checkpoint1 = new InspectionCheckpoint(
        checkpointId: new CheckpointId(1),
        title: 'Checkpoint 1',
        description: 'Description 1',
        order: 1,
        status: CheckpointStatus::PENDING
    );

    $checkpoint2 = new InspectionCheckpoint(
        checkpointId: new CheckpointId(2),
        title: 'Checkpoint 2',
        description: 'Description 2',
        order: 2,
        status: CheckpointStatus::PENDING
    );

    $inspection = new Inspection(
        inspectionId: new InspectionId(1),
        surveyName: 'Test Inspection',
        surveyDescription: 'Test Description',
        checkpoints: [$checkpoint1, $checkpoint2]
    );

    $updatedCheckpoint = new InspectionCheckpoint(
        checkpointId: new CheckpointId(1),
        title: 'Updated Checkpoint 1',
        description: 'Updated Description 1',
        order: 1,
        status: CheckpointStatus::OK
    );

    $inspection->updateCheckpoint($updatedCheckpoint);

    $checkpoints = $inspection->getCheckpoints();
    expect($checkpoints)->toHaveCount(2);
    expect($checkpoints[0]->getTitle())->toBe('Updated Checkpoint 1');
    expect($checkpoints[0]->getStatus())->toBe(CheckpointStatus::OK);
    expect($checkpoints[1])->toBe($checkpoint2); // Unchanged
});

it('handles updating non-existent checkpoint', function () {
    $checkpoint1 = new InspectionCheckpoint(
        checkpointId: new CheckpointId(1),
        title: 'Checkpoint 1',
        description: 'Description 1',
        order: 1
    );

    $inspection = new Inspection(
        inspectionId: new InspectionId(1),
        surveyName: 'Test Inspection',
        surveyDescription: 'Test Description',
        checkpoints: [$checkpoint1]
    );

    $nonExistentCheckpoint = new InspectionCheckpoint(
        checkpointId: new CheckpointId(999),
        title: 'Non-existent Checkpoint',
        description: 'Description',
        order: 999
    );

    $inspection->updateCheckpoint($nonExistentCheckpoint);

    // Should not change anything
    expect($inspection->getCheckpoints())->toHaveCount(1);
    expect($inspection->getCheckpoints()[0])->toBe($checkpoint1);
});

it('converts to array correctly', function () {
    $createdAt = Carbon::now();
    $updatedAt = Carbon::now()->addHour();

    $checkpoint1 = new InspectionCheckpoint(
        checkpointId: new CheckpointId(1),
        title: 'Checkpoint 1',
        description: 'Description 1',
        order: 1,
        status: CheckpointStatus::OK
    );

    $checkpoint2 = new InspectionCheckpoint(
        checkpointId: new CheckpointId(2),
        title: 'Checkpoint 2',
        description: 'Description 2',
        order: 2,
        status: CheckpointStatus::DEFECT
    );

    $inspection = new Inspection(
        inspectionId: new InspectionId(1),
        surveyName: 'Test Inspection',
        surveyDescription: 'Test Description',
        overallStatus: InspectionStatus::IN_PROGRESS,
        checkpoints: [$checkpoint1, $checkpoint2],
        createdAt: $createdAt,
        updatedAt: $updatedAt
    );

    $array = $inspection->toArray();

    expect($array)->toBeArray();
    expect($array['id'])->toBe(1);
    expect($array['survey_name'])->toBe('Test Inspection');
    expect($array['survey_description'])->toBe('Test Description');
    expect($array['overall_status'])->toBe('IN_PROGRESS');
    expect($array['checkpoints'])->toHaveCount(2);
    expect($array['checkpoints'][0]['id'])->toBe(1);
    expect($array['checkpoints'][1]['id'])->toBe(2);
    expect($array['created_at'])->toBe($createdAt->toISOString());
    expect($array['updated_at'])->toBe($updatedAt->toISOString());
});
