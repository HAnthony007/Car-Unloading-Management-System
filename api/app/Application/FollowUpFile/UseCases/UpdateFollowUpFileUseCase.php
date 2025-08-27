<?php

namespace App\Application\FollowUpFile\UseCases;

use App\Application\FollowUpFile\DTOs\UpdateFollowUpFileDTO;
use App\Domain\FollowUpFile\Entities\FollowUpFile;
use App\Domain\FollowUpFile\Repositories\FollowUpFileRepositoryInterface;
use App\Domain\FollowUpFile\ValueObjects\FollowUpFileId;
use App\Domain\PortCall\ValueObjects\PortCallId;
use App\Domain\Vehicle\ValueObjects\VehicleId;

final class UpdateFollowUpFileUseCase
{
    public function __construct(private readonly FollowUpFileRepositoryInterface $repository) {}

    public function execute(UpdateFollowUpFileDTO $dto): FollowUpFile
    {
        $existing = $this->repository->findById(new FollowUpFileId($dto->followUpFileId));
        if (! $existing) {
            throw new \RuntimeException('FollowUpFile not found.');
        }

        $entity = new FollowUpFile(
            followUpFileId: $existing->getFollowUpFileId(),
            billOfLading: $dto->getBillOfLadingVO() ?? $existing->getBillOfLading(),
            status: $dto->getStatusVO() ?? $existing->getStatus(),
            vehicleId: $dto->vehicleId ? new VehicleId($dto->vehicleId) : $existing->getVehicleId(),
            portCallId: $dto->portCallId ? new PortCallId($dto->portCallId) : $existing->getPortCallId(),
        );

        return $this->repository->save($entity);
    }
}
