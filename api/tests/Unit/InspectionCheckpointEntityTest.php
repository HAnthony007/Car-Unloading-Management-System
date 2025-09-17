<?php

use App\Domain\Inspection\Entities\InspectionCheckpoint;
use App\Domain\Inspection\ValueObjects\CheckpointId;
use App\Domain\Inspection\ValueObjects\CheckpointStatus;
use Carbon\Carbon;

it('creates inspection checkpoint with default values', function () {
    $checkpoint = new InspectionCheckpoint(
        checkpointId: new CheckpointId(1),
        title: 'Test Checkpoint',
        description: 'Test Description',
        order: 1
    );

    expect($checkpoint->getCheckpointId()->getValue())->toBe(1);
    expect($checkpoint->getTitle())->toBe('Test Checkpoint');
    expect($checkpoint->getDescription())->toBe('Test Description');
    expect($checkpoint->getOrder())->toBe(1);
    expect($checkpoint->getStatus())->toBe(CheckpointStatus::PENDING);
    expect($checkpoint->getComment())->toBeNull();
    expect($checkpoint->getPhotos())->toBeEmpty();
});

it('creates inspection checkpoint with custom values', function () {
    $checkpoint = new InspectionCheckpoint(
        checkpointId: new CheckpointId(1),
        title: 'Test Checkpoint',
        description: 'Test Description',
        order: 1,
        status: CheckpointStatus::OK,
        comment: 'Test comment',
        photos: ['photo1.jpg', 'photo2.jpg']
    );

    expect($checkpoint->getStatus())->toBe(CheckpointStatus::OK);
    expect($checkpoint->getComment())->toBe('Test comment');
    expect($checkpoint->getPhotos())->toHaveCount(2);
    expect($checkpoint->getPhotos())->toContain('photo1.jpg');
    expect($checkpoint->getPhotos())->toContain('photo2.jpg');
});

it('updates checkpoint status', function () {
    $checkpoint = new InspectionCheckpoint(
        checkpointId: new CheckpointId(1),
        title: 'Test Checkpoint',
        description: 'Test Description',
        order: 1,
        status: CheckpointStatus::PENDING
    );

    $checkpoint->updateStatus(CheckpointStatus::OK);

    expect($checkpoint->getStatus())->toBe(CheckpointStatus::OK);
});

it('updates checkpoint comment', function () {
    $checkpoint = new InspectionCheckpoint(
        checkpointId: new CheckpointId(1),
        title: 'Test Checkpoint',
        description: 'Test Description',
        order: 1
    );

    $checkpoint->updateComment('New comment');

    expect($checkpoint->getComment())->toBe('New comment');
});

it('updates checkpoint comment to null', function () {
    $checkpoint = new InspectionCheckpoint(
        checkpointId: new CheckpointId(1),
        title: 'Test Checkpoint',
        description: 'Test Description',
        order: 1,
        comment: 'Old comment'
    );

    $checkpoint->updateComment(null);

    expect($checkpoint->getComment())->toBeNull();
});

it('adds photo to checkpoint', function () {
    $checkpoint = new InspectionCheckpoint(
        checkpointId: new CheckpointId(1),
        title: 'Test Checkpoint',
        description: 'Test Description',
        order: 1,
        photos: ['photo1.jpg']
    );

    $checkpoint->addPhoto('photo2.jpg');

    expect($checkpoint->getPhotos())->toHaveCount(2);
    expect($checkpoint->getPhotos())->toContain('photo1.jpg');
    expect($checkpoint->getPhotos())->toContain('photo2.jpg');
});

it('removes photo from checkpoint', function () {
    $checkpoint = new InspectionCheckpoint(
        checkpointId: new CheckpointId(1),
        title: 'Test Checkpoint',
        description: 'Test Description',
        order: 1,
        photos: ['photo1.jpg', 'photo2.jpg', 'photo3.jpg']
    );

    $checkpoint->removePhoto(1); // Remove photo2.jpg

    expect($checkpoint->getPhotos())->toHaveCount(2);
    expect($checkpoint->getPhotos())->toContain('photo1.jpg');
    expect($checkpoint->getPhotos())->toContain('photo3.jpg');
    expect($checkpoint->getPhotos())->not->toContain('photo2.jpg');
});

it('removes photo and reindexes array', function () {
    $checkpoint = new InspectionCheckpoint(
        checkpointId: new CheckpointId(1),
        title: 'Test Checkpoint',
        description: 'Test Description',
        order: 1,
        photos: ['photo1.jpg', 'photo2.jpg', 'photo3.jpg']
    );

    $checkpoint->removePhoto(0); // Remove first photo

    $photos = $checkpoint->getPhotos();
    expect($photos)->toHaveCount(2);
    expect($photos[0])->toBe('photo2.jpg');
    expect($photos[1])->toBe('photo3.jpg');
});

it('handles removing non-existent photo index', function () {
    $checkpoint = new InspectionCheckpoint(
        checkpointId: new CheckpointId(1),
        title: 'Test Checkpoint',
        description: 'Test Description',
        order: 1,
        photos: ['photo1.jpg']
    );

    $checkpoint->removePhoto(5); // Non-existent index

    expect($checkpoint->getPhotos())->toHaveCount(1);
    expect($checkpoint->getPhotos())->toContain('photo1.jpg');
});

it('converts to array correctly', function () {
    $createdAt = Carbon::now();
    $updatedAt = Carbon::now()->addHour();

    $checkpoint = new InspectionCheckpoint(
        checkpointId: new CheckpointId(1),
        title: 'Test Checkpoint',
        description: 'Test Description',
        order: 1,
        status: CheckpointStatus::OK,
        comment: 'Test comment',
        photos: ['photo1.jpg'],
        createdAt: $createdAt,
        updatedAt: $updatedAt
    );

    $array = $checkpoint->toArray();

    expect($array)->toBeArray();
    expect($array['id'])->toBe(1);
    expect($array['title_checkpoint'])->toBe('Test Checkpoint');
    expect($array['description_checkpoint'])->toBe('Test Description');
    expect($array['order_checkpoint'])->toBe(1);
    expect($array['status'])->toBe('ok');
    expect($array['comment'])->toBe('Test comment');
    expect($array['photos'])->toBe(['photo1.jpg']);
    expect($array['created_at'])->toBe($createdAt->toISOString());
    expect($array['updated_at'])->toBe($updatedAt->toISOString());
});
