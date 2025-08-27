<?php

namespace App\Domain\Survey\ValueObjects;

use Carbon\Carbon;

final class SurveyDate
{
    public function __construct(private readonly ?Carbon $value) {}

    public function getValue(): ?Carbon
    {
        return $this->value;
    }
}
