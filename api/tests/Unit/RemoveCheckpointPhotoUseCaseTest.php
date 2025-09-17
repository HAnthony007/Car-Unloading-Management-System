<?php

use App\Application\Inspection\DTOs\RemoveCheckpointPhotoDTO;
use App\Application\Inspection\UseCases\RemoveCheckpointPhotoUseCase;
use App\Domain\Inspection\Entities\InspectionCheckpoint;
use App\Domain\Inspection\Repositories\InspectionRepositoryInterface;
use App\Domain\Inspection\ValueObjects\CheckpointId;
use App\Domain\Inspection\ValueObjects\CheckpointStatus;
use App\Domain\Storage\Repositories\FileStorageRepositoryInterface;

beforeEach(function () {
    $this->repository = Mockery::mock(InspectionRepositoryInterface::class);
    $this->fileStorage = Mockery::mock(FileStorageRepositoryInterface::class);
    $this->useCase = new RemoveCheckpointPhotoUseCase($this->repository, $this->fileStorage);
});

it('removes photo from checkpoint successfully', function () {
    $checkpointId = 1;
    $photoIndex = 0;
    $photoUrl = 'https://example.com/photo.jpg';

    $checkpoint = new InspectionCheckpoint(
        checkpointId: new CheckpointId($checkpointId),
        title: 'Test Checkpoint',
        description: 'Test Description',
        order: 1,
        status: CheckpointStatus::PENDING,
        photos: [$photoUrl, 'https://example.com/photo2.jpg']
    );

    $this->repository
        ->shouldReceive('findCheckpointById')
        ->with(Mockery::type(CheckpointId::class))
        ->andReturn($checkpoint);

    $this->fileStorage
        ->shouldReceive('deleteFile')
        ->with($photoUrl)
        ->andReturn(true);

    $this->repository
        ->shouldReceive('saveCheckpoint')
        ->with(Mockery::type(InspectionCheckpoint::class))
        ->andReturn($checkpoint);

    $dto = new RemoveCheckpointPhotoDTO($checkpointId, $photoIndex);
    $result = $this->useCase->execute($dto);

    expect($result)->toBeArray();
    expect($result['checkpoint_id'])->toBe($checkpointId);
    expect($result['photos'])->toHaveCount(1);
    expect($result['photos'])->not->toContain($photoUrl);
});

it('throws exception when checkpoint not found', function () {
    $checkpointId = 999;
    $photoIndex = 0;

    $this->repository
        ->shouldReceive('findCheckpointById')
        ->with(Mockery::type(CheckpointId::class))
        ->andReturn(null);

    $dto = new RemoveCheckpointPhotoDTO($checkpointId, $photoIndex);

    expect(fn () => $this->useCase->execute($dto))
        ->toThrow(RuntimeException::class, 'Checkpoint not found');
});

it('throws exception when photo index not found', function () {
    $checkpointId = 1;
    $photoIndex = 5;

    $checkpoint = new InspectionCheckpoint(
        checkpointId: new CheckpointId($checkpointId),
        title: 'Test Checkpoint',
        description: 'Test Description',
        order: 1,
        status: CheckpointStatus::PENDING,
        photos: ['https://example.com/photo.jpg']
    );

    $this->repository
        ->shouldReceive('findCheckpointById')
        ->andReturn($checkpoint);

    $dto = new RemoveCheckpointPhotoDTO($checkpointId, $photoIndex);

    expect(fn () => $this->useCase->execute($dto))
        ->toThrow(RuntimeException::class, 'Photo not found');
});

it('removes last photo from checkpoint', function () {
    $checkpointId = 1;
    $photoIndex = 0;
    $photoUrl = 'https://example.com/photo.jpg';

    $checkpoint = new InspectionCheckpoint(
        checkpointId: new CheckpointId($checkpointId),
        title: 'Test Checkpoint',
        description: 'Test Description',
        order: 1,
        status: CheckpointStatus::PENDING,
        photos: [$photoUrl]
    );

    $this->repository
        ->shouldReceive('findCheckpointById')
        ->andReturn($checkpoint);

    $this->fileStorage
        ->shouldReceive('deleteFile')
        ->with($photoUrl)
        ->andReturn(true);

    $this->repository
        ->shouldReceive('saveCheckpoint')
        ->andReturn($checkpoint);

    $dto = new RemoveCheckpointPhotoDTO($checkpointId, $photoIndex);
    $result = $this->useCase->execute($dto);

    expect($result['photos'])->toHaveCount(0);
    expect($result['photos'])->toBeEmpty();
});
