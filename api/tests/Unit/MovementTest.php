<?php

use App\Models\Movement;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

it('uses movement_id as primary key', function () {
    $model = new Movement;

    expect($model->getKeyName())->toBe('movement_id');
});

it('defines discharge relationship', function () {
    $model = new Movement;

    expect($model->discharge())->toBeInstanceOf(BelongsTo::class);
});

it('defines user relationship', function () {
    $model = new Movement;

    expect($model->user())->toBeInstanceOf(BelongsTo::class);
});

it('casts timestamp to datetime', function () {
    $model = new Movement;

    expect($model->hasCast('timestamp', 'datetime'))->toBeTrue();
});
