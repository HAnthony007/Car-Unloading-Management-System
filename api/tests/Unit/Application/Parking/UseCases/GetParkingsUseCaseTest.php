<?php

namespace Tests\Unit\Application\Parking\UseCases;

use App\Application\Parking\UseCases\GetParkingsUseCase;
use App\Domain\Parking\Entities\Parking;
use App\Domain\Parking\Repositories\ParkingRepositoryInterface;
use App\Domain\Parking\ValueObjects\ParkingId;
use App\Domain\Parking\ValueObjects\ParkingName;
use App\Domain\Parking\ValueObjects\Location;
use App\Domain\Parking\ValueObjects\Capacity;
use PHPUnit\Framework\TestCase;

class GetParkingsUseCaseTest extends TestCase
{
    public function testGetAllParkings()
    {
        // Créer des objets Parking réels au lieu de mocks
        $parking1 = new Parking(
            parkingId: new ParkingId(1),
            parkingName: new ParkingName('Parking 1'),
            location: new Location('Location 1'),
            capacity: new Capacity(100)
        );
        
        $parking2 = new Parking(
            parkingId: new ParkingId(2),
            parkingName: new ParkingName('Parking 2'),
            location: new Location('Location 2'),
            capacity: new Capacity(200)
        );
        
        $parkings = [$parking1, $parking2];
        
        $repository = $this->createMock(ParkingRepositoryInterface::class);
        $repository->method('findAll')
            ->willReturn($parkings);
        
        $useCase = new GetParkingsUseCase($repository);
        $result = $useCase->execute();
        
        $this->assertSame($parkings, $result);
        $this->assertCount(2, $result);
    }
    
    public function testGetEmptyParkingsList()
    {
        $repository = $this->createMock(ParkingRepositoryInterface::class);
        $repository->method('findAll')
            ->willReturn([]);
        
        $useCase = new GetParkingsUseCase($repository);
        $result = $useCase->execute();
        
        $this->assertIsArray($result);
        $this->assertEmpty($result);
    }
}
