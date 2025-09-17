<?php

use App\Application\Inspection\DTOs\ConfirmInspectionDTO;
use App\Application\Inspection\UseCases\ConfirmInspectionUseCase;
use App\Domain\Inspection\Entities\Inspection;
use App\Domain\Inspection\Entities\InspectionCheckpoint;
use App\Domain\Inspection\Repositories\InspectionRepositoryInterface;
use App\Domain\Inspection\ValueObjects\CheckpointId;
use App\Domain\Inspection\ValueObjects\CheckpointStatus;
use App\Domain\Inspection\ValueObjects\InspectionId;
use App\Domain\Inspection\ValueObjects\InspectionStatus;

beforeEach(function () {
    $this->repository = Mockery::mock(InspectionRepositoryInterface::class);
    $this->useCase = new ConfirmInspectionUseCase($this->repository);
});

it('confirms inspection successfully when all checkpoints are completed', function () {
    $inspectionId = 1;

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
        status: CheckpointStatus::OK
    );

    $inspection = new Inspection(
        inspectionId: new InspectionId($inspectionId),
        surveyName: 'Test Inspection',
        surveyDescription: 'Test Description',
        overallStatus: InspectionStatus::IN_PROGRESS,
        checkpoints: [$checkpoint1, $checkpoint2]
    );

    $this->repository
        ->shouldReceive('findById')
        ->with(Mockery::type(InspectionId::class))
        ->andReturn($inspection);

    $this->repository
        ->shouldReceive('save')
        ->with(Mockery::type(Inspection::class))
        ->andReturn($inspection);

    $dto = new ConfirmInspectionDTO($inspectionId);
    $result = $this->useCase->execute($dto);

    expect($result)->toBeArray();
    expect($result['inspection_id'])->toBe($inspectionId);
    expect($result['status'])->toBe('COMPLETED');
    expect($inspection->getOverallStatus())->toBe(InspectionStatus::COMPLETED);
});

it('throws exception when inspection not found', function () {
    $inspectionId = 999;

    $this->repository
        ->shouldReceive('findById')
        ->with(Mockery::type(InspectionId::class))
        ->andReturn(null);

    $dto = new ConfirmInspectionDTO($inspectionId);

    expect(fn () => $this->useCase->execute($dto))
        ->toThrow(RuntimeException::class, 'Inspection not found');
});

it('throws exception when checkpoints are not completed', function () {
    $inspectionId = 1;

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
        status: CheckpointStatus::PENDING
    );

    $inspection = new Inspection(
        inspectionId: new InspectionId($inspectionId),
        surveyName: 'Test Inspection',
        surveyDescription: 'Test Description',
        overallStatus: InspectionStatus::IN_PROGRESS,
        checkpoints: [$checkpoint1, $checkpoint2]
    );

    $this->repository
        ->shouldReceive('findById')
        ->andReturn($inspection);

    $dto = new ConfirmInspectionDTO($inspectionId);

    expect(fn () => $this->useCase->execute($dto))
        ->toThrow(RuntimeException::class, 'All checkpoints must be completed before confirming the inspection');
});

it('confirms inspection with mixed checkpoint statuses', function () {
    $inspectionId = 1;

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

    $checkpoint3 = new InspectionCheckpoint(
        checkpointId: new CheckpointId(3),
        title: 'Checkpoint 3',
        description: 'Description 3',
        order: 3,
        status: CheckpointStatus::NOT_APPLICABLE
    );

    $inspection = new Inspection(
        inspectionId: new InspectionId($inspectionId),
        surveyName: 'Test Inspection',
        surveyDescription: 'Test Description',
        overallStatus: InspectionStatus::IN_PROGRESS,
        checkpoints: [$checkpoint1, $checkpoint2, $checkpoint3]
    );

    $this->repository
        ->shouldReceive('findById')
        ->andReturn($inspection);

    $this->repository
        ->shouldReceive('save')
        ->andReturn($inspection);

    $dto = new ConfirmInspectionDTO($inspectionId);
    $result = $this->useCase->execute($dto);

    expect($result['status'])->toBe('COMPLETED');
    expect($inspection->getOverallStatus())->toBe(InspectionStatus::COMPLETED);
});
