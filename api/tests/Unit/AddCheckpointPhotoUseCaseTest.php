<?php

use App\Application\Inspection\DTOs\AddCheckpointPhotoDTO;
use App\Application\Inspection\UseCases\AddCheckpointPhotoUseCase;
use App\Domain\Inspection\Entities\InspectionCheckpoint;
use App\Domain\Inspection\Repositories\InspectionRepositoryInterface;
use App\Domain\Inspection\ValueObjects\CheckpointId;
use App\Domain\Inspection\ValueObjects\CheckpointStatus;
use App\Domain\Storage\Repositories\FileStorageRepositoryInterface;
use Illuminate\Http\UploadedFile;

beforeEach(function () {
    $this->repository = Mockery::mock(InspectionRepositoryInterface::class);
    $this->fileStorage = Mockery::mock(FileStorageRepositoryInterface::class);
    $this->useCase = new AddCheckpointPhotoUseCase($this->repository, $this->fileStorage);
});

it('adds photo to checkpoint successfully', function () {
    $checkpointId = 1;
    $photoUrl = 'https://example.com/photo.jpg';

    $checkpoint = new InspectionCheckpoint(
        checkpointId: new CheckpointId($checkpointId),
        title: 'Test Checkpoint',
        description: 'Test Description',
        order: 1,
        status: CheckpointStatus::PENDING
    );

    $uploadedFile = UploadedFile::fake()->image('test.jpg');

    $this->repository
        ->shouldReceive('findCheckpointById')
        ->with(Mockery::type(CheckpointId::class))
        ->andReturn($checkpoint);

    $this->fileStorage
        ->shouldReceive('storeInspectionPhoto')
        ->with($uploadedFile, $checkpointId)
        ->andReturn($photoUrl);

    $this->repository
        ->shouldReceive('saveCheckpoint')
        ->with(Mockery::type(InspectionCheckpoint::class))
        ->andReturn($checkpoint);

    $dto = new AddCheckpointPhotoDTO($checkpointId, $uploadedFile);
    $result = $this->useCase->execute($dto);

    expect($result)->toBeArray();
    expect($result['checkpoint_id'])->toBe($checkpointId);
    expect($result['photo_url'])->toBe($photoUrl);
    expect($result['photos'])->toContain($photoUrl);
    expect($checkpoint->getPhotos())->toContain($photoUrl);
});

it('throws exception when checkpoint not found', function () {
    $checkpointId = 999;
    $uploadedFile = UploadedFile::fake()->image('test.jpg');

    $this->repository
        ->shouldReceive('findCheckpointById')
        ->with(Mockery::type(CheckpointId::class))
        ->andReturn(null);

    $dto = new AddCheckpointPhotoDTO($checkpointId, $uploadedFile);

    expect(fn () => $this->useCase->execute($dto))
        ->toThrow(RuntimeException::class, 'Checkpoint not found');
});

it('adds multiple photos to checkpoint', function () {
    $checkpointId = 1;
    $photoUrl1 = 'https://example.com/photo1.jpg';
    $photoUrl2 = 'https://example.com/photo2.jpg';

    $checkpoint = new InspectionCheckpoint(
        checkpointId: new CheckpointId($checkpointId),
        title: 'Test Checkpoint',
        description: 'Test Description',
        order: 1,
        status: CheckpointStatus::PENDING,
        photos: [$photoUrl1]
    );

    $uploadedFile = UploadedFile::fake()->image('test2.jpg');

    $this->repository
        ->shouldReceive('findCheckpointById')
        ->andReturn($checkpoint);

    $this->fileStorage
        ->shouldReceive('storeInspectionPhoto')
        ->with($uploadedFile, $checkpointId)
        ->andReturn($photoUrl2);

    $this->repository
        ->shouldReceive('saveCheckpoint')
        ->andReturn($checkpoint);

    $dto = new AddCheckpointPhotoDTO($checkpointId, $uploadedFile);
    $result = $this->useCase->execute($dto);

    expect($result['photos'])->toHaveCount(2);
    expect($result['photos'])->toContain($photoUrl1);
    expect($result['photos'])->toContain($photoUrl2);
});
