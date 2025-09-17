<?php

namespace App\Domain\Inspection\ValueObjects;

enum CheckpointStatus: string
{
    case OK = 'ok';
    case DEFECT = 'defaut';
    case NOT_APPLICABLE = 'na';
    case PENDING = 'pending';

    public function getValue(): string
    {
        return $this->value;
    }
}
