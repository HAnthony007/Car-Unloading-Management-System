<?php

namespace App\Domain\Inspection\ValueObjects;

enum InspectionStatus: string
{
    case PENDING = 'PENDING';
    case IN_PROGRESS = 'IN_PROGRESS';
    case COMPLETED = 'COMPLETED';

    public function getValue(): string
    {
        return $this->value;
    }
}
