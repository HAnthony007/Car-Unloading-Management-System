<?php

namespace App\Domain\PortCall\Enums;

enum PortCallStatus: string
{
    case Pending = 'pending';
    case InProgress = 'in_progress';
    case Completed = 'completed';

    /**
     * Return raw string values
     *
     * @return string[]
     */
    public static function values(): array
    {
        return array_map(fn (PortCallStatus $s) => $s->value, self::cases());
    }
}
