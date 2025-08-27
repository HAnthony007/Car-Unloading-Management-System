<?php

namespace App\Domain\Discharge\ValueObjects;

use Carbon\Carbon;

final class DateTimeValue
{
    public function __construct(private readonly ?Carbon $value) {}

    public function getValue(): ?Carbon
    {
        return $this->value;
    }
}
