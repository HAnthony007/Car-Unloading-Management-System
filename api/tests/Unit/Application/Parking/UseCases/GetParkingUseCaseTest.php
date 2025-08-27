<?php

namespace Tests\Unit\Application\Parking\UseCases;

use App\Application\Parking\UseCases\GetParkingUseCase;
use App\Domain\Parking\Entities\Parking;
use App\Domain\Parking\Repositories\ParkingRepositoryInterface;
use App\Domain\Parking\ValueObjects\ParkingId;
use App\Domain\Parking\ValueObjects\ParkingName;
use App\Domain\Parking\ValueObjects\Location;
use App\Domain\Parking\ValueObjects\Capacity;
use App\Domain\Parking\ValueObjects\ParkingNumber;
use PHPUnit\Framework\TestCase;

class GetParkingUseCaseTest extends TestCase
{
    public function testGetExistingNormalParking()
    {
        $parkingId = 2;
        
        // Créer un parking réel au lieu d'un mock
        $parking = new Parking(
            parkingId: new ParkingId($parkingId),
            parkingName: new ParkingName('Test Parking'),
            location: new Location('Test Location'),
            capacity: new Capacity(100)
        );
        
        $repository = $this->createMock(ParkingRepositoryInterface::class);
        $repository->method('findById')
            ->with($this->callback(function ($arg) use ($parkingId) {
                return $arg instanceof ParkingId && $arg->getValue() === $parkingId;
            }))
            ->willReturn($parking);
        
        $useCase = new GetParkingUseCase($repository);
        $result = $useCase->execute($parkingId);
        
        $this->assertSame($parking, $result);
    }
    
    public function testGetMahasarikaParking()
    {
        $parkingId = 1;
        
        // Créer un parking Mahasarika réel avec numéro de parking
        $parking = new Parking(
            parkingId: new ParkingId($parkingId),
            parkingName: new ParkingName('Mahasarika'),
            location: new Location('Mahasarika Location'),
            capacity: new Capacity(200),
            parkingNumber: new ParkingNumber('M001')
        );
        
        $repository = $this->createMock(ParkingRepositoryInterface::class);
        $repository->method('findById')
            ->with($this->callback(function ($arg) use ($parkingId) {
                return $arg instanceof ParkingId && $arg->getValue() === $parkingId;
            }))
            ->willReturn($parking);
        
        $useCase = new GetParkingUseCase($repository);
        $result = $useCase->execute($parkingId);
        
        $this->assertSame($parking, $result);
        $this->assertEquals('Mahasarika', $result->getParkingName()->getValue());
        $this->assertNotNull($result->getParkingNumber());
        $this->assertEquals('M001', $result->getParkingNumber()->getValue());
    }
    
    public function testGetNonExistingParking()
    {
        $parkingId = 999;
        
        $repository = $this->createMock(ParkingRepositoryInterface::class);
        $repository->method('findById')
            ->willReturn(null);
        
        $useCase = new GetParkingUseCase($repository);
        
        $this->expectException(\RuntimeException::class);
        $this->expectExceptionMessage('Parking not found');
        
        $useCase->execute($parkingId);
    }
}
