<?php

namespace App\Domain\PortCall\ValueObjects;

use Carbon\Carbon;

final class DateTimeValue
{
    public function __construct(private readonly ?Carbon $value)
    {
        // No validation here; controller/request layer validates format.
    }

    public function getValue(): ?Carbon
    {
        return $this->value;
    }
}
