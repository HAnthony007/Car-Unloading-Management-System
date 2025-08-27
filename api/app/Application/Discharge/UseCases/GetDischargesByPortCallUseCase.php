<?php

namespace App\Application\Discharge\UseCases;

use App\Domain\Discharge\Entities\Discharge;
use App\Domain\Discharge\Repositories\DischargeRepositoryInterface;
use App\Domain\PortCall\ValueObjects\PortCallId;

final class GetDischargesByPortCallUseCase
{
    public function __construct(private readonly DischargeRepositoryInterface $repository) {}

    /** @return array<int, Discharge> */
    public function execute(int $portCallId): array
    {
        return $this->repository->findByPortCallId(new PortCallId($portCallId));
    }
}
