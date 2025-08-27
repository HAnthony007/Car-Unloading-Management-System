<?php

namespace App\Application\Vessel\UseCases;

use App\Application\Vessel\DTOs\CreateVesselDTO;
use App\Domain\Vessel\Entities\Vessel;
use App\Domain\Vessel\Repositories\VesselRepositoryInterface;
use App\Domain\Vessel\ValueObjects\Flag;
use App\Domain\Vessel\ValueObjects\ImoNumber;
use App\Domain\Vessel\ValueObjects\VesselName as VesselNameVO;

final class CreateVesselUseCase
{
    public function __construct(private readonly VesselRepositoryInterface $repository) {}

    public function execute(CreateVesselDTO $dto): Vessel
    {
        $vessel = new Vessel(
            vesselId: null,
            imoNumber: new ImoNumber($dto->imoNo),
            vesselName: new VesselNameVO($dto->vesselName),
            flag: new Flag($dto->flag),
        );

        return $this->repository->save($vessel);
    }
}
