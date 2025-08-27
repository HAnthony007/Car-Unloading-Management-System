<?php

namespace App\Domain\FollowUpFile\Repositories;

use App\Domain\FollowUpFile\Entities\FollowUpFile;
use App\Domain\FollowUpFile\ValueObjects\BillOfLading;
use App\Domain\FollowUpFile\ValueObjects\FollowUpFileId;

interface FollowUpFileRepositoryInterface
{
    public function findById(FollowUpFileId $id): ?FollowUpFile;

    public function findByBillOfLading(BillOfLading $bol): ?FollowUpFile;

    /** @return array<int, FollowUpFile> */
    public function findAll(): array;

    public function save(FollowUpFile $fuf): FollowUpFile;

    public function delete(FollowUpFileId $id): bool;
}
