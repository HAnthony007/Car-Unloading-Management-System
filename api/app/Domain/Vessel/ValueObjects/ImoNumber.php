<?php

namespace App\Domain\Vessel\ValueObjects;

final class ImoNumber
{
    private string $value;

    public function __construct(string $value)
    {
        // IMO number is typically 7 digits, sometimes prefixed with 'IMO'
        $v = strtoupper(trim($value));
        if (str_starts_with($v, 'IMO')) {
            $v = trim(substr($v, 3));
        }
        if (!preg_match('/^\d{7}$/', $v)) {
            throw new \InvalidArgumentException('IMO number must be 7 digits.');
        }
        $this->value = $v;
    }

    public function getValue(): string
    {
        return $this->value;
    }
}
