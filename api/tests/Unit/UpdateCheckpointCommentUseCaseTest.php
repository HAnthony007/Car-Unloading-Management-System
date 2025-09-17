<?php

use App\Application\Inspection\DTOs\UpdateCheckpointCommentDTO;
use App\Application\Inspection\UseCases\UpdateCheckpointCommentUseCase;
use App\Domain\Inspection\Entities\InspectionCheckpoint;
use App\Domain\Inspection\Repositories\InspectionRepositoryInterface;
use App\Domain\Inspection\ValueObjects\CheckpointId;
use App\Domain\Inspection\ValueObjects\CheckpointStatus;

beforeEach(function () {
    $this->repository = Mockery::mock(InspectionRepositoryInterface::class);
    $this->useCase = new UpdateCheckpointCommentUseCase($this->repository);
});

it('updates checkpoint comment successfully', function () {
    $checkpointId = 1;
    $comment = 'This is a test comment';

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

    $dto = new UpdateCheckpointCommentDTO($checkpointId, $comment);
    $result = $this->useCase->execute($dto);

    expect($result)->toBeArray();
    expect($result['checkpoint_id'])->toBe($checkpointId);
    expect($result['comment'])->toBe($comment);
    expect($checkpoint->getComment())->toBe($comment);
});

it('throws exception when checkpoint not found', function () {
    $checkpointId = 999;
    $comment = 'Test comment';

    $this->repository
        ->shouldReceive('findCheckpointById')
        ->with(Mockery::type(CheckpointId::class))
        ->andReturn(null);

    $dto = new UpdateCheckpointCommentDTO($checkpointId, $comment);

    expect(fn () => $this->useCase->execute($dto))
        ->toThrow(RuntimeException::class, 'Checkpoint not found');
});

it('updates comment to empty string', function () {
    $checkpointId = 1;
    $comment = '';

    $checkpoint = new InspectionCheckpoint(
        checkpointId: new CheckpointId($checkpointId),
        title: 'Test Checkpoint',
        description: 'Test Description',
        order: 1,
        status: CheckpointStatus::PENDING,
        comment: 'Previous comment'
    );

    $this->repository
        ->shouldReceive('findCheckpointById')
        ->andReturn($checkpoint);

    $this->repository
        ->shouldReceive('saveCheckpoint')
        ->andReturn($checkpoint);

    $dto = new UpdateCheckpointCommentDTO($checkpointId, $comment);
    $result = $this->useCase->execute($dto);

    expect($result['comment'])->toBe('');
    expect($checkpoint->getComment())->toBe('');
});
