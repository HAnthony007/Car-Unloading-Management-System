<?php

namespace App\Application\Discharge\UseCases;

use App\Application\Discharge\DTOs\UpdateDischargeDTO;
use App\Domain\Discharge\Entities\Discharge;
use App\Domain\Discharge\Repositories\DischargeRepositoryInterface;
use App\Domain\Discharge\ValueObjects\DateTimeValue;
use App\Domain\Discharge\ValueObjects\DischargeId;
use App\Domain\PortCall\ValueObjects\PortCallId;
use Carbon\Carbon;

final class UpdateDischargeUseCase
{
    public function __construct(private readonly DischargeRepositoryInterface $repository) {}

    public function execute(UpdateDischargeDTO $dto): Discharge
    {
        $existing = $this->repository->findById(new DischargeId($dto->dischargeId));
        if (! $existing) {
            throw new \RuntimeException('Discharge not found');
        }

        $entity = new Discharge(
            dischargeId: $existing->getDischargeId(),
            dischargeDate: $dto->dischargeDate !== null ? new DateTimeValue($dto->dischargeDate ? Carbon::parse($dto->dischargeDate) : null) : $existing->getDischargeDate(),
            portCallId: $dto->portCallId !== null ? new PortCallId($dto->portCallId) : $existing->getPortCallId(),
            createdAt: $existing->getCreatedAt(),
            updatedAt: now(),
        );

        return $this->repository->save($entity);
    }
}
