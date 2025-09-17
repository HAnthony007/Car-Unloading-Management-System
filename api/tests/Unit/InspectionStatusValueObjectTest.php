<?php

use App\Domain\Inspection\ValueObjects\InspectionStatus;

it('creates inspection status with valid values', function () {
    expect(InspectionStatus::PENDING->getValue())->toBe('PENDING');
    expect(InspectionStatus::IN_PROGRESS->getValue())->toBe('IN_PROGRESS');
    expect(InspectionStatus::COMPLETED->getValue())->toBe('COMPLETED');
});

it('creates inspection status from string', function () {
    expect(InspectionStatus::from('PENDING'))->toBe(InspectionStatus::PENDING);
    expect(InspectionStatus::from('IN_PROGRESS'))->toBe(InspectionStatus::IN_PROGRESS);
    expect(InspectionStatus::from('COMPLETED'))->toBe(InspectionStatus::COMPLETED);
});

it('throws exception for invalid status', function () {
    expect(fn () => InspectionStatus::from('INVALID'))
        ->toThrow(ValueError::class);
});

it('compares inspection statuses correctly', function () {
    expect(InspectionStatus::PENDING)->toBe(InspectionStatus::PENDING);
    expect(InspectionStatus::PENDING)->not->toBe(InspectionStatus::IN_PROGRESS);
    expect(InspectionStatus::IN_PROGRESS)->toBe(InspectionStatus::IN_PROGRESS);
    expect(InspectionStatus::COMPLETED)->toBe(InspectionStatus::COMPLETED);
});
