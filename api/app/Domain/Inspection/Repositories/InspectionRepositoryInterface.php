<?php

namespace App\Domain\Inspection\Repositories;

use App\Domain\Inspection\Entities\Inspection;
use App\Domain\Inspection\Entities\InspectionCheckpoint;
use App\Domain\Inspection\ValueObjects\CheckpointId;
use App\Domain\Inspection\ValueObjects\InspectionId;

interface InspectionRepositoryInterface
{
    public function findById(InspectionId $id): ?Inspection;

    public function findByDischargeId(int $dischargeId): array;

    public function save(Inspection $inspection): Inspection;

    public function findCheckpointById(CheckpointId $checkpointId): ?InspectionCheckpoint;

    public function saveCheckpoint(InspectionCheckpoint $checkpoint): InspectionCheckpoint;
}
