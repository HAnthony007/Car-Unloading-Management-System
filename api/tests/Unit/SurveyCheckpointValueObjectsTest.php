<?php

use App\Domain\SurveyCheckpoint\ValueObjects\CheckpointComment;
use App\Domain\SurveyCheckpoint\ValueObjects\CheckpointTitle;
use App\Domain\SurveyCheckpoint\ValueObjects\SurveyCheckpointId;

it('creates valid value objects', function () {
    expect(new SurveyCheckpointId(1)->getValue())->toBe(1);
    expect(new CheckpointTitle('Title')->getValue())->toBe('Title');
    expect(new CheckpointComment(str_repeat('a', 10))->getValue())->toBe(str_repeat('a', 10));
});

it('rejects invalid values', function () {
    new SurveyCheckpointId(0);
})->throws(InvalidArgumentException::class);

it('rejects empty title', function () {
    new CheckpointTitle('');
})->throws(InvalidArgumentException::class);

it('rejects too long title', function () {
    new CheckpointTitle(str_repeat('a', 256));
})->throws(InvalidArgumentException::class);

it('rejects too long comment', function () {
    new CheckpointComment(str_repeat('a', 1001));
})->throws(InvalidArgumentException::class);
