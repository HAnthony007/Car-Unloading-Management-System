<?php

namespace App\Application\Role\UseCases;

use App\Domain\Role\Repositories\RoleRepositoryInterface;

final class GetRolesUseCase
{
    public function __construct(private readonly RoleRepositoryInterface $roleRepository) {}

    /**
     * @return array An array of domain Role entities
     */
    public function execute(): array
    {
        return $this->roleRepository->findAll();
    }
}
