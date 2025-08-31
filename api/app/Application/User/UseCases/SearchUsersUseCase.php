<?php

namespace App\Application\User\UseCases;

use App\Application\User\DTOs\UserSearchCriteriaDTO;
use App\Domain\User\Repositories\UserRepositoryInterface;

final class SearchUsersUseCase
{
    public function __construct(
        private readonly UserRepositoryInterface $userRepository,
    ) {}

    public function execute(UserSearchCriteriaDTO $criteria): array
    {
        $users = $this->userRepository->findAll();

        // Filter by matriculation prefix
        if ($criteria->matriculationPrefix) {
            $users = array_filter($users, function ($user) use ($criteria) {
                return str_starts_with(
                    $user->getMatriculationNumber()->getValue(),
                    strtoupper($criteria->matriculationPrefix)
                );
            });
        }

        // Filter by role(s)
        if ($criteria->roles && count($criteria->roles) > 0) {
            $roleNames = array_flip($criteria->roles);
            $users = array_filter($users, function ($user) use ($roleNames) {
                $name = $user->getRole()?->getRoleName();
                if ($name === null) {
                    return false; // no role entity available → exclude unless we map IDs elsewhere
                }

                return isset($roleNames[strtolower($name)]);
            });
        } elseif ($criteria->role && $criteria->role !== '') {
            $roleName = $criteria->role;
            $users = array_filter($users, function ($user) use ($roleName) {
                $name = $user->getRole()?->getRoleName();

                return $name !== null && strtolower($name) === strtolower($roleName);
            });
        } elseif ($criteria->roleIds && count($criteria->roleIds) > 0) {
            $roleSet = array_flip($criteria->roleIds);
            $users = array_filter($users, function ($user) use ($roleSet) {
                return isset($roleSet[$user->getRoleId()->getValue()]);
            });
        } elseif ($criteria->roleId) {
            $users = array_filter($users, function ($user) use ($criteria) {
                return $user->getRoleId()->getValue() === $criteria->roleId;
            });
        }

        // Filter by email verification status
        if ($criteria->emailVerified !== null) {
            $users = array_filter($users, function ($user) use ($criteria) {
                return $criteria->emailVerified
                    ? $user->getEmailVerifiedAt() !== null
                    : $user->getEmailVerifiedAt() === null;
            });
        }

        // Filter by active status (email verified and recent creation)
        if ($criteria->isActive !== null) {
            $users = array_filter($users, function ($user) use ($criteria) {
                $isActive = $user->getEmailVerifiedAt() !== null &&
                           $user->getCreatedAt()->isAfter(now()->subDays(90));

                return $criteria->isActive === $isActive;
            });
        }

        // Search by term (name, email, matriculation)
        if ($criteria->searchTerm) {
            $searchTerm = strtolower($criteria->searchTerm);
            $users = array_filter($users, function ($user) use ($searchTerm) {
                return str_contains(strtolower($user->getFullName()), $searchTerm) ||
                       str_contains(strtolower($user->getEmail()->getValue()), $searchTerm) ||
                       str_contains(strtolower($user->getMatriculationNumber()->getValue()), $searchTerm);
            });
        }

        // Convert to array and reset keys
        $users = array_values($users);

        // Pagination
        $total = count($users);
        $perPage = $criteria->perPage;
        $currentPage = $criteria->page;
        $lastPage = ceil($total / $perPage);

        $offset = ($currentPage - 1) * $perPage;
        $paginatedUsers = array_slice($users, $offset, $perPage);

        return [
            'data' => $paginatedUsers,
            'current_page' => $currentPage,
            'from' => $offset + 1,
            'last_page' => $lastPage,
            'path' => request()->url(),
            'per_page' => $perPage,
            'to' => min($offset + $perPage, $total),
            'total' => $total,
        ];
    }
}
