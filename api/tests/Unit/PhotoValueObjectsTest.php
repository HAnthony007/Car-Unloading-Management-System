<?php

use App\Domain\Photo\ValueObjects\PhotoId;

it('PhotoId accepts positive integers', function () {
    $id = new PhotoId(1);
    expect($id->getValue())->toBe(1)
        ->and((string) $id)->toBe('1');
});

it('PhotoId rejects non-positive integers', function () {
    new PhotoId(0);
})->throws(InvalidArgumentException::class);
