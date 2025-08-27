<?php

use App\Application\SurveyCheckpoint\DTOs\CreateSurveyCheckpointDTO;
use App\Application\SurveyCheckpoint\DTOs\UpdateSurveyCheckpointDTO;
use App\Application\SurveyCheckpoint\UseCases\CreateSurveyCheckpointUseCase;
use App\Application\SurveyCheckpoint\UseCases\DeleteSurveyCheckpointUseCase;
use App\Application\SurveyCheckpoint\UseCases\GetSurveyCheckpointUseCase;
use App\Application\SurveyCheckpoint\UseCases\UpdateSurveyCheckpointUseCase;
use App\Domain\Survey\ValueObjects\SurveyId;
use App\Domain\SurveyCheckpoint\Entities\SurveyCheckpoint as DomainSurveyCheckpoint;
use App\Domain\SurveyCheckpoint\Repositories\SurveyCheckpointRepositoryInterface;
use App\Domain\SurveyCheckpoint\ValueObjects\SurveyCheckpointId;

class FakeSurveyCheckpointRepo implements SurveyCheckpointRepositoryInterface
{
    /** @var array<int, DomainSurveyCheckpoint> */
    public array $items = [];

    private int $nextId = 1;

    public function findById(SurveyCheckpointId $id): ?DomainSurveyCheckpoint
    {
        return $this->items[$id->getValue()] ?? null;
    }

    public function findAll(): array
    {
        return array_values($this->items);
    }

    public function findBySurveyId(SurveyId $surveyId): array
    {
        return array_values(array_filter($this->items, fn ($c) => $c->getSurveyId()->getValue() === $surveyId->getValue()));
    }

    public function save(DomainSurveyCheckpoint $c): DomainSurveyCheckpoint
    {
        if (! $c->getCheckpointId()) {
            $id = $this->nextId++;
            $c = new DomainSurveyCheckpoint(new SurveyCheckpointId($id), $c->getTitle(), $c->getComment(), $c->getSurveyId());
        }
        $this->items[$c->getCheckpointId()->getValue()] = $c;

        return $c;
    }

    public function delete(SurveyCheckpointId $id): bool
    {
        if (! isset($this->items[$id->getValue()])) {
            return false;
        }
        unset($this->items[$id->getValue()]);

        return true;
    }
}

it('creates, reads, updates and deletes a survey checkpoint', function () {
    $repo = new FakeSurveyCheckpointRepo;

    $create = new CreateSurveyCheckpointUseCase($repo);
    $get = new GetSurveyCheckpointUseCase($repo);
    $update = new UpdateSurveyCheckpointUseCase($repo);
    $delete = new DeleteSurveyCheckpointUseCase($repo);

    $created = $create->execute(new CreateSurveyCheckpointDTO('Title', 'Comment', 1));
    expect($created->getCheckpointId())->not()->toBeNull();
    $found = $get->execute($created->getCheckpointId()->getValue());
    expect($found->getTitle()->getValue())->toBe('Title');

    $updated = $update->execute(new UpdateSurveyCheckpointDTO($created->getCheckpointId()->getValue(), 'New Title', null));
    expect($updated->getTitle()->getValue())->toBe('New Title');

    $delete->execute($created->getCheckpointId()->getValue());
    expect(fn () => $get->execute($created->getCheckpointId()->getValue()))->toThrow(RuntimeException::class);
});
