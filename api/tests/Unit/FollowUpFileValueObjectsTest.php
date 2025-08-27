<?php

use App\Domain\FollowUpFile\ValueObjects\BillOfLading;
use App\Domain\FollowUpFile\ValueObjects\FollowUpFileId;
use App\Domain\FollowUpFile\ValueObjects\FollowUpStatus;

it('creates valid FollowUpFileId', function () {
    $id = new FollowUpFileId(1);
    expect($id->getValue())->toBe(1);
});

it('throws on invalid FollowUpFileId', function () {
    new FollowUpFileId(0);
})->throws(InvalidArgumentException::class);

it('normalizes and compares BillOfLading', function () {
    $bol = new BillOfLading('  abc123  ');
    expect((string) $bol)->toBe('ABC123');

    $other = new BillOfLading('abc123');
    expect($bol->equals($other))->toBeTrue();
});

it('throws on empty BillOfLading', function () {
    new BillOfLading('   ');
})->throws(InvalidArgumentException::class);

it('accepts only allowed FollowUpStatus values', function () {
    $open = new FollowUpStatus('open');
    $progress = new FollowUpStatus('IN_PROGRESS');
    $closed = new FollowUpStatus('CLOSED');

    expect($open->getValue())->toBe('OPEN')
        ->and($progress->getValue())->toBe('IN_PROGRESS')
        ->and($closed->getValue())->toBe('CLOSED');
});

it('throws on invalid FollowUpStatus', function () {
    new FollowUpStatus('invalid');
})->throws(InvalidArgumentException::class);
