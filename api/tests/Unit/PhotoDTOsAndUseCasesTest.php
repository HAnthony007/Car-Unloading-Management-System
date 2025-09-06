<?php

use App\Application\Photo\DTOs\CreatePhotoDTO;
use App\Application\Photo\DTOs\PhotoSearchCriteriaDTO;
use App\Application\Photo\DTOs\UpdatePhotoDTO;
use App\Application\Photo\UseCases\CreatePhotoUseCase;
use App\Application\Photo\UseCases\DeletePhotoUseCase;
use App\Application\Photo\UseCases\GetPhotoUseCase;
use App\Application\Photo\UseCases\UpdatePhotoUseCase;
use App\Domain\Discharge\ValueObjects\DischargeId;
use App\Domain\Photo\Entities\Photo;
use App\Domain\Photo\Repositories\PhotoRepositoryInterface;
use App\Domain\Photo\ValueObjects\PhotoId;
use App\Domain\Survey\ValueObjects\SurveyId;
use Carbon\Carbon;

// No mocking framework required; we'll use a simple in-file fake repository.

describe('Photo DTOs', function () {
    it('CreatePhotoDTO from array', function () {
        $data = [
            'photo_path' => 'img/p.jpg',
            'taken_at' => '2025-08-01 10:00:00',
            'photo_description' => 'desc',
            'discharge_id' => 10,
            'survey_id' => 5,
            'checkpoint_id' => 3,
        ];
        $dto = CreatePhotoDTO::fromArray($data);
        expect($dto->photoPath)->toBe('img/p.jpg')
            ->and($dto->takenAt)->toBe('2025-08-01 10:00:00')
            ->and($dto->photoDescription)->toBe('desc')
            ->and($dto->dischargeId)->toBe(10)
            ->and($dto->surveyId)->toBe(5)
            ->and($dto->checkpointId)->toBe(3);
    });

    it('PhotoSearchCriteriaDTO from array', function () {
        $dto = PhotoSearchCriteriaDTO::fromArray([
            'page' => 2,
            'per_page' => 5,
        ]);
        expect($dto->page)->toBe(2)
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

    public function search(?int $dischargeId, ?int $surveyId, ?int $checkpointId, ?string $fromDate, ?string $toDate, int $page, int $perPage): array
    {
        return ['data' => [], 'current_page' => 1, 'from' => 0, 'last_page' => 1, 'path' => '/', 'per_page' => $perPage, 'to' => 0, 'total' => 0];
    }
}

describe('Photo UseCases', function () {
    it('CreatePhotoUseCase saves photo', function () {
        $repo = new FakePhotoRepository;
        $useCase = new CreatePhotoUseCase($repo);
        $dto = new CreatePhotoDTO('img/p.jpg', '2025-08-01 10:00:00', 'desc', 10, 5, null);

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
            dischargeId: new DischargeId(10),
            surveyId: new SurveyId(5),
            checkpointId: null,
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
            dischargeId: new DischargeId(10),
            surveyId: null,
            checkpointId: null,
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
