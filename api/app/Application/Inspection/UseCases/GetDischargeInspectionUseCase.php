<?php

namespace App\Application\Inspection\UseCases;

use App\Application\Inspection\DTOs\SurveyWithCheckpointsViewModel;
use App\Domain\Discharge\ValueObjects\DischargeId;
use App\Domain\Survey\Entities\Survey;
use App\Domain\Survey\Repositories\SurveyRepositoryInterface;
use App\Domain\SurveyCheckpoint\Entities\SurveyCheckpoint;
use App\Domain\SurveyCheckpoint\Repositories\SurveyCheckpointRepositoryInterface;

// just to ensure autoload kept if unused

final class GetDischargeInspectionUseCase
{
    public function __construct(
        private readonly SurveyRepositoryInterface $surveys,
        private readonly SurveyCheckpointRepositoryInterface $checkpoints,
    ) {}

    /**
     * @return array<int, SurveyWithCheckpointsViewModel>
     */
    public function execute(int $dischargeId): array
    {
        $surveyEntities = $this->surveys->findByDischargeId(new DischargeId($dischargeId));

        // Ensure stable ordering by survey_id ascending if domain entity exposes it.
        usort($surveyEntities, fn (Survey $a, Survey $b) => $a->getSurveyId()->getValue() <=> $b->getSurveyId()->getValue());

        $result = [];
        foreach ($surveyEntities as $survey) {
            $checkpointEntities = $this->checkpoints->findBySurveyId($survey->getSurveyId());
            // Order by 'order' (some may be null -> push to end)
            usort(
                $checkpointEntities,
                fn (SurveyCheckpoint $c1, SurveyCheckpoint $c2) => ($c1->getOrder() ?? 9999) <=> ($c2->getOrder() ?? 9999)
            );
            $result[] = new SurveyWithCheckpointsViewModel($survey, $checkpointEntities);
        }

        return $result;
    }
}
