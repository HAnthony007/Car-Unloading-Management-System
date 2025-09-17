<?php

use App\Domain\Inspection\ValueObjects\CheckpointStatus;

it('creates checkpoint status with valid values', function () {
    expect(CheckpointStatus::OK->getValue())->toBe('ok');
    expect(CheckpointStatus::DEFECT->getValue())->toBe('defaut');
    expect(CheckpointStatus::NOT_APPLICABLE->getValue())->toBe('na');
    expect(CheckpointStatus::PENDING->getValue())->toBe('pending');
});

it('creates checkpoint status from string', function () {
    expect(CheckpointStatus::from('ok'))->toBe(CheckpointStatus::OK);
    expect(CheckpointStatus::from('defaut'))->toBe(CheckpointStatus::DEFECT);
    expect(CheckpointStatus::from('na'))->toBe(CheckpointStatus::NOT_APPLICABLE);
    expect(CheckpointStatus::from('pending'))->toBe(CheckpointStatus::PENDING);
});

it('throws exception for invalid status', function () {
    expect(fn () => CheckpointStatus::from('invalid'))
        ->toThrow(ValueError::class);
});

it('compares checkpoint statuses correctly', function () {
    expect(CheckpointStatus::OK)->toBe(CheckpointStatus::OK);
    expect(CheckpointStatus::OK)->not->toBe(CheckpointStatus::DEFECT);
    expect(CheckpointStatus::DEFECT)->toBe(CheckpointStatus::DEFECT);
    expect(CheckpointStatus::NOT_APPLICABLE)->toBe(CheckpointStatus::NOT_APPLICABLE);
    expect(CheckpointStatus::PENDING)->toBe(CheckpointStatus::PENDING);
});
