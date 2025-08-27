<?php

namespace Tests\Unit\Application\Parking\UseCases;

use App\Application\Parking\DTOs\CreateParkingDTO;
use App\Application\Parking\UseCases\CreateParkingUseCase;
use App\Domain\Parking\Entities\Parking;
use App\Domain\Parking\Repositories\ParkingRepositoryInterface;
use App\Domain\Parking\ValueObjects\ParkingId;
use App\Domain\Parking\ValueObjects\ParkingName;
use App\Domain\Parking\ValueObjects\Location;
use App\Domain\Parking\ValueObjects\Capacity;
use App\Domain\Parking\ValueObjects\ParkingNumber;
use Carbon\Carbon;
use PHPUnit\Framework\TestCase;

class CreateParkingUseCaseTest extends TestCase
{
    public function testCreateParkingWithValidData()
    {
        $dto = new CreateParkingDTO(
            parkingName: 'Test Parking',
            location: 'Test Location',
            capacity: 100,
            parkingNumber: 'P-123'
        );
        
        // Créer un parking réel au lieu d'un mock
        $parking = new Parking(
            parkingId: new ParkingId(1),
            parkingName: new ParkingName('Test Parking'),
            location: new Location('Test Location'),
            capacity: new Capacity(100),
            parkingNumber: new ParkingNumber('P-123')
        );
        
        $repository = $this->createMock(ParkingRepositoryInterface::class);
        $repository->method('save')
            ->willReturn($parking);
        
        $useCase = new CreateParkingUseCase($repository);
        $result = $useCase->execute($dto);
        
        $this->assertSame($parking, $result);
    }
    
    public function testCreateMahasarikaParkingWithoutNumber()
    {
        $dto = new CreateParkingDTO(
            parkingName: 'Mahasarika',
            location: 'Test Location',
            capacity: 100,
            parkingNumber: null
        );
        
        $repository = $this->createMock(ParkingRepositoryInterface::class);
        $useCase = new CreateParkingUseCase($repository);
        
        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessage('Parking number is required for Mahasarika parking.');
        
        $useCase->execute($dto);
    }
}
