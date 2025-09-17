<?php

use App\Application\Inspection\DTOs\UpdateCheckpointStatusDTO;
use App\Application\Inspection\UseCases\UpdateCheckpointStatusUseCase;
use App\Domain\Inspection\Entities\InspectionCheckpoint;
use App\Domain\Inspection\Repositories\InspectionRepositoryInterface;
use App\Domain\Inspection\ValueObjects\CheckpointId;
use App\Domain\Inspection\ValueObjects\CheckpointStatus;

beforeEach(function () {
    $this->repository = Mockery::mock(InspectionRepositoryInterface::class);
    $this->useCase = new UpdateCheckpointStatusUseCase($this->repository);
});

it('updates checkpoint status successfully', function () {
    $checkpointId = 1;
    $status = 'ok';

    $checkpoint = new InspectionCheckpoint(
        checkpointId: new CheckpointId($checkpointId),
        title: 'Test Checkpoint',
        description: 'Test Description',
        order: 1,
        status: CheckpointStatus::PENDING
    );

    $this->repository
        ->shouldReceive('findCheckpointById')
        ->with(Mockery::type(CheckpointId::class))
        ->andReturn($checkpoint);

    $this->repository
        ->shouldReceive('saveCheckpoint')
        ->with(Mockery::type(InspectionCheckpoint::class))
        ->andReturn($checkpoint);

    $dto = new UpdateCheckpointStatusDTO($checkpointId, $status);
    $result = $this->useCase->execute($dto);

    expect($result)->toBeArray();
    expect($result['checkpoint_id'])->toBe($checkpointId);
    expect($result['status'])->toBe($status);
    expect($checkpoint->getStatus())->toBe(CheckpointStatus::OK);
});

it('throws exception when checkpoint not found', function () {
    $checkpointId = 999;
    $status = 'ok';

    $this->repository
        ->shouldReceive('findCheckpointById')
        ->with(Mockery::type(CheckpointId::class))
        ->andReturn(null);

    $dto = new UpdateCheckpointStatusDTO($checkpointId, $status);

    expect(fn () => $this->useCase->execute($dto))
        ->toThrow(RuntimeException::class, 'Checkpoint not found');
});

it('updates status to defect', function () {
    $checkpointId = 1;
    $status = 'defaut';

    $checkpoint = new InspectionCheckpoint(
        checkpointId: new CheckpointId($checkpointId),
        title: 'Test Checkpoint',
        description: 'Test Description',
        order: 1,
        status: CheckpointStatus::PENDING
    );

    $this->repository
        ->shouldReceive('findCheckpointById')
        ->andReturn($checkpoint);

    $this->repository
        ->shouldReceive('saveCheckpoint')
        ->andReturn($checkpoint);

    $dto = new UpdateCheckpointStatusDTO($checkpointId, $status);
    $result = $this->useCase->execute($dto);

    expect($result['status'])->toBe('defaut');
    expect($checkpoint->getStatus())->toBe(CheckpointStatus::DEFECT);
});

it('updates status to not applicable', function () {
    $checkpointId = 1;
    $status = 'na';

    $checkpoint = new InspectionCheckpoint(
        checkpointId: new CheckpointId($checkpointId),
        title: 'Test Checkpoint',
        description: 'Test Description',
        order: 1,
        status: CheckpointStatus::PENDING
    );

    $this->repository
        ->shouldReceive('findCheckpointById')
        ->andReturn($checkpoint);

    $this->repository
        ->shouldReceive('saveCheckpoint')
        ->andReturn($checkpoint);

    $dto = new UpdateCheckpointStatusDTO($checkpointId, $status);
    $result = $this->useCase->execute($dto);

    expect($result['status'])->toBe('na');
    expect($checkpoint->getStatus())->toBe(CheckpointStatus::NOT_APPLICABLE);
});
