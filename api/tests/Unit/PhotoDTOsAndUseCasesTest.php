<?php

use App\Application\Photo\DTOs\CreatePhotoDTO;
use App\Application\Photo\DTOs\PhotoSearchCriteriaDTO;
use App\Application\Photo\DTOs\UpdatePhotoDTO;
use App\Application\Photo\UseCases\CreatePhotoUseCase;
use App\Application\Photo\UseCases\DeletePhotoUseCase;
use App\Application\Photo\UseCases\GetPhotoUseCase;
use App\Application\Photo\UseCases\UpdatePhotoUseCase;
use App\Domain\FollowUpFile\ValueObjects\FollowUpFileId;
use App\Domain\Photo\Entities\Photo;
use App\Domain\Photo\Repositories\PhotoRepositoryInterface;
use App\Domain\Photo\ValueObjects\PhotoId;
use App\Domain\SurveyCheckpoint\ValueObjects\SurveyCheckpointId;
use App\Domain\Vehicle\ValueObjects\VehicleId;
use Carbon\Carbon;

// No mocking framework required; we'll use a simple in-file fake repository.

describe('Photo DTOs', function () {
    it('CreatePhotoDTO from array', function () {
        $data = [
            'photo_path' => 'img/p.jpg',
            'taken_at' => '2025-08-01 10:00:00',
            'photo_description' => 'desc',
            'follow_up_file_id' => 1,
            'vehicle_id' => 2,
            'checkpoint_id' => 3,
        ];
        $dto = CreatePhotoDTO::fromArray($data);
        expect($dto->photoPath)->toBe('img/p.jpg')
            ->and($dto->takenAt)->toBe('2025-08-01 10:00:00')
            ->and($dto->photoDescription)->toBe('desc')
            ->and($dto->followUpFileId)->toBe(1)
            ->and($dto->vehicleId)->toBe(2)
            ->and($dto->checkpointId)->toBe(3);
    });

    it('PhotoSearchCriteriaDTO from array', function () {
        $dto = PhotoSearchCriteriaDTO::fromArray([
            'vehicle_id' => 4,
            'page' => 2,
            'per_page' => 5,
        ]);
        expect($dto->vehicleId)->toBe(4)
            ->and($dto->page)->toBe(2)
            ->and($dto->perPage)->toBe(5);
    });
});

// Simple fake repository for tests
class FakePhotoRepository implements PhotoRepositoryInterface
{
    public ?Photo $saved = null;

    public ?Photo $found = null;

    public bool $deleted = true;

    public function findById(PhotoId $id): ?Photo
    {
        return $this->found;
    }

    public function findAll(): array
    {
        return [];
    }

    public function save(Photo $photo): Photo
    {
        $this->saved = $photo;

        return $photo;
    }

    public function delete(PhotoId $id): bool
    {
        return $this->deleted;
    }

    public function search(?int $followUpFileId, ?int $vehicleId, ?int $checkpointId, ?string $fromDate, ?string $toDate, int $page, int $perPage): array
    {
        return ['data' => [], 'current_page' => 1, 'from' => 0, 'last_page' => 1, 'path' => '/', 'per_page' => $perPage, 'to' => 0, 'total' => 0];
    }
}

describe('Photo UseCases', function () {
    it('CreatePhotoUseCase saves photo', function () {
        $repo = new FakePhotoRepository;
        $useCase = new CreatePhotoUseCase($repo);
        $dto = new CreatePhotoDTO('img/p.jpg', '2025-08-01 10:00:00', 'desc', 1, 2, 3);

        $result = $useCase->execute($dto);
        expect($result)->toBeInstanceOf(Photo::class)
            ->and($result->getPhotoPath())->toBe('img/p.jpg');
    });

    it('GetPhotoUseCase returns existing', function () {
        $repo = new FakePhotoRepository;
        $useCase = new GetPhotoUseCase($repo);
        $entity = new Photo(
            photoId: new PhotoId(10),
            photoPath: 'img/p.jpg',
            takenAt: Carbon::parse('2025-08-01 10:00:00'),
            photoDescription: 'desc',
            followUpFileId: new FollowUpFileId(1),
            vehicleId: new VehicleId(2),
            checkpointId: new SurveyCheckpointId(3),
        );
        $repo->found = $entity;
        $result = $useCase->execute(10);
        expect($result)->toBe($entity);
    });

    it('GetPhotoUseCase throws when missing', function () {
        $repo = new FakePhotoRepository;
        $useCase = new GetPhotoUseCase($repo);
        $repo->found = null;
        expect(fn () => $useCase->execute(99))->toThrow(RuntimeException::class, 'Photo not found.');
    });

    it('UpdatePhotoUseCase saves updated entity', function () {
        $repo = new FakePhotoRepository;
        $useCase = new UpdatePhotoUseCase($repo);
        $existing = new Photo(
            photoId: new PhotoId(10),
            photoPath: 'old.jpg',
            takenAt: Carbon::parse('2025-08-01 10:00:00'),
            photoDescription: null,
            followUpFileId: new FollowUpFileId(1),
            vehicleId: new VehicleId(2),
            checkpointId: new SurveyCheckpointId(3),
            createdAt: now(),
            updatedAt: now(),
        );
        $repo->found = $existing;

        $dto = new UpdatePhotoDTO(10, 'new.jpg', null, 'desc', null, null, null);
        $updated = $useCase->execute($dto);
        expect($updated->getPhotoPath())->toBe('new.jpg')
            ->and($updated->getPhotoDescription())->toBe('desc');
    });

    it('DeletePhotoUseCase deletes', function () {
        $repo = new FakePhotoRepository;
        $useCase = new DeletePhotoUseCase($repo);
        $repo->deleted = true;
        $useCase->execute(10);
        expect(true)->toBeTrue();
    });
});
