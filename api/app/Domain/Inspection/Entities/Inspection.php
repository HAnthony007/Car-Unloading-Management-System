<?php

namespace App\Domain\Inspection\Entities;

use App\Domain\Inspection\ValueObjects\InspectionId;
use App\Domain\Inspection\ValueObjects\InspectionStatus;
use Carbon\Carbon;

final class Inspection
{
    private InspectionStatus $overallStatus;

    private array $checkpoints;

    public function __construct(
        private readonly ?InspectionId $inspectionId,
        private readonly string $surveyName,
        private readonly string $surveyDescription,
        InspectionStatus $overallStatus = InspectionStatus::PENDING,
        array $checkpoints = [],
        private readonly ?Carbon $createdAt = null,
        private readonly ?Carbon $updatedAt = null,
    ) {
        $this->overallStatus = $overallStatus;
        $this->checkpoints = $checkpoints;
    }

    public function getInspectionId(): ?InspectionId
    {
        return $this->inspectionId;
    }

    public function getSurveyName(): string
    {
        return $this->surveyName;
    }

    public function getSurveyDescription(): string
    {
        return $this->surveyDescription;
    }

    public function getOverallStatus(): InspectionStatus
    {
        return $this->overallStatus;
    }

    public function getCheckpoints(): array
    {
        return $this->checkpoints;
    }

    public function getCreatedAt(): ?Carbon
    {
        return $this->createdAt;
    }

    public function getUpdatedAt(): ?Carbon
    {
        return $this->updatedAt;
    }

    public function updateStatus(InspectionStatus $status): void
    {
        $this->overallStatus = $status;
    }

    public function addCheckpoint(InspectionCheckpoint $checkpoint): void
    {
        $this->checkpoints[] = $checkpoint;
    }

    public function updateCheckpoint(InspectionCheckpoint $checkpoint): void
    {
        foreach ($this->checkpoints as $index => $existingCheckpoint) {
            if ($existingCheckpoint->getCheckpointId()->getValue() === $checkpoint->getCheckpointId()->getValue()) {
                $this->checkpoints[$index] = $checkpoint;
                break;
            }
        }
    }

    public function toArray(): array
    {
        return [
            'id' => $this->inspectionId?->getValue(),
            'survey_name' => $this->surveyName,
            'survey_description' => $this->surveyDescription,
            'overall_status' => $this->overallStatus->getValue(),
            'checkpoints' => array_map(fn ($checkpoint) => $checkpoint->toArray(), $this->checkpoints),
            'created_at' => $this->createdAt?->toISOString(),
            'updated_at' => $this->updatedAt?->toISOString(),
        ];
    }
}
