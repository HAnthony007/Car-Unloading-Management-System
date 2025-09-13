<?php

namespace App\Application\Inspection\DTOs;

use App\Domain\Survey\Entities\Survey;
use App\Domain\SurveyCheckpoint\Entities\SurveyCheckpoint;

final class SurveyWithCheckpointsViewModel
{
    /** @param array<int, SurveyCheckpoint> $checkpoints */
    public function __construct(
        public readonly Survey $survey,
        public readonly array $checkpoints,
    ) {}
}
