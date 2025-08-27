<?php

namespace App\Application\Vessel\UseCases;

use App\Application\Vessel\DTOs\UpdateVesselDTO;
use App\Domain\Vessel\Entities\Vessel;
use App\Domain\Vessel\Repositories\VesselRepositoryInterface;
use App\Domain\Vessel\ValueObjects\Flag;
use App\Domain\Vessel\ValueObjects\ImoNumber;
use App\Domain\Vessel\ValueObjects\VesselId;
use App\Domain\Vessel\ValueObjects\VesselName as VesselNameVO;

final class UpdateVesselUseCase
{
    public function __construct(private readonly VesselRepositoryInterface $repository) {}

    public function execute(UpdateVesselDTO $dto): Vessel
    {
        $existing = $this->repository->findById(new VesselId($dto->vesselId));
        if (! $existing) {
            throw new \RuntimeException('Vessel not found.');
        }

        $vessel = new Vessel(
            vesselId: new VesselId($dto->vesselId),
            imoNumber: new ImoNumber($dto->imoNo ?? $existing->getImoNumber()->getValue()),
            vesselName: new VesselNameVO($dto->vesselName ?? $existing->getVesselName()->getValue()),
            flag: new Flag($dto->flag ?? $existing->getFlag()->getValue()),
        );

        return $this->repository->save($vessel);
    }
}
