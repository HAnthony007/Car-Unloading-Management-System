<?php

namespace App\Domain\User\Services;

use App\Domain\User\Repositories\UserRepositoryInterface;
use App\Domain\User\ValueObjects\MatriculationNumber;

final class MatriculationNumberGeneratorService
{
    public function __construct(
        private readonly UserRepositoryInterface $userRepository,
    ) {}

    public function generateNext(string $institutionPrefix): MatriculationNumber
    {
        $year = date('Y');
        $pattern = strtoupper($institutionPrefix).'-'.$year.'-';

        $counter = 1;
        do {
            $sequence = str_pad($counter, 3, '0', STR_PAD_LEFT);
            $candidate = $pattern.$sequence;
            $matriculationNumber = new MatriculationNumber($candidate);
            $counter++;
        } while ($this->userRepository->matriculationExists($matriculationNumber));

        return $matriculationNumber;
    }

    public function isValidFormat(string $matriculationNumber): bool
    {
        try {
            new MatriculationNumber($matriculationNumber);

            return true;
        } catch (\InvalidArgumentException) {
            return false;
        }
    }

    public function extractInstitutionFromMatriculation(MatriculationNumber $matriculationNumber): string
    {
        return $matriculationNumber->getPrefix();
    }
}
