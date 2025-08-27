<?php

namespace App\Application\FollowUpFile\UseCases;

use App\Application\FollowUpFile\DTOs\CreateFollowUpFileDTO;
use App\Domain\FollowUpFile\Entities\FollowUpFile;
use App\Domain\FollowUpFile\Repositories\FollowUpFileRepositoryInterface;
use App\Domain\PortCall\ValueObjects\PortCallId;
use App\Domain\Vehicle\ValueObjects\VehicleId;

final class CreateFollowUpFileUseCase
{
    public function __construct(private readonly FollowUpFileRepositoryInterface $repository) {}

    public function execute(CreateFollowUpFileDTO $dto): FollowUpFile
    {
        $entity = new FollowUpFile(
            followUpFileId: null,
            billOfLading: $dto->getBillOfLadingVO(),
            status: $dto->getStatusVO(),
            vehicleId: new VehicleId($dto->vehicleId),
            portCallId: new PortCallId($dto->portCallId),
        );

        return $this->repository->save($entity);
    }
}
