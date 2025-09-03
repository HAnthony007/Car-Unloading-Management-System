<?php

namespace App\Application\Manifest\Exceptions;

class ManifestImportException extends \RuntimeException
{
    /** @var array<int, string> */
    public array $errors = [];

    /** @var array<string, int|array> */
    public array $stats = [];

    public bool $rolledBack = true;
}
