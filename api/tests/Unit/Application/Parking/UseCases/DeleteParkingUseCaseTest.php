<?php

namespace Tests\Unit\Application\Parking\UseCases;

use App\Application\Parking\UseCases\DeleteParkingUseCase;
use App\Domain\Parking\Repositories\ParkingRepositoryInterface;
use App\Domain\Parking\ValueObjects\ParkingId;
use PHPUnit\Framework\TestCase;

class DeleteParkingUseCaseTest extends TestCase
{
    public function test_delete_existing_parking()
    {
        $parkingId = 1;

        $repository = $this->createMock(ParkingRepositoryInterface::class);
        $repository->method('delete')
            ->with($this->callback(function ($arg) use ($parkingId) {
                return $arg instanceof ParkingId && $arg->getValue() === $parkingId;
            }))
            ->willReturn(true);

        $useCase = new DeleteParkingUseCase($repository);

        // Si aucune exception n'est levée, le test passe
        $useCase->execute($parkingId);
        $this->assertTrue(true);
    }

    public function test_delete_non_existing_parking()
    {
        $parkingId = 999;

        $repository = $this->createMock(ParkingRepositoryInterface::class);
        $repository->method('delete')
            ->willReturn(false);

        $useCase = new DeleteParkingUseCase($repository);

        $this->expectException(\RuntimeException::class);
        $this->expectExceptionMessage('Parking not found');

        $useCase->execute($parkingId);
    }
}
