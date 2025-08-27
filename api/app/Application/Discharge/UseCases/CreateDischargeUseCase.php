<?php

namespace App\Application\Discharge\UseCases;

use App\Application\Discharge\DTOs\CreateDischargeDTO;
use App\Domain\Discharge\Entities\Discharge;
use App\Domain\Discharge\Repositories\DischargeRepositoryInterface;
use App\Domain\Discharge\ValueObjects\DateTimeValue;
use App\Domain\PortCall\ValueObjects\PortCallId;
use Carbon\Carbon;

final class CreateDischargeUseCase
{
    public function __construct(private readonly DischargeRepositoryInterface $repository) {}

    public function execute(CreateDischargeDTO $dto): Discharge
    {
        $entity = new Discharge(
            dischargeId: null,
            dischargeDate: new DateTimeValue(Carbon::parse($dto->dischargeDate)),
            portCallId: new PortCallId($dto->portCallId),
        );

        return $this->repository->save($entity);
    }
}
