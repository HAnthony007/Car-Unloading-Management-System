<?php

use App\Application\Survey\DTOs\CreateSurveyDTO;
use App\Application\Survey\DTOs\UpdateSurveyDTO;
use App\Application\Survey\UseCases\CreateSurveyUseCase;
use App\Application\Survey\UseCases\DeleteSurveyUseCase;
use App\Application\Survey\UseCases\GetSurveyUseCase;
use App\Application\Survey\UseCases\UpdateSurveyUseCase;
use App\Domain\FollowUpFile\ValueObjects\FollowUpFileId;
use App\Domain\Survey\Entities\Survey;
use App\Domain\Survey\Repositories\SurveyRepositoryInterface;
use App\Domain\Survey\ValueObjects\SurveyDate;
use App\Domain\Survey\ValueObjects\SurveyId;
use App\Domain\Survey\ValueObjects\SurveyResult;
use App\Domain\User\ValueObjects\UserId;
use Carbon\Carbon;
use PHPUnit\Framework\TestCase;

class SurveyDomainAndUseCasesTest extends TestCase
{
    public function test_value_objects_and_entity()
    {
        $date = new SurveyDate(Carbon::parse('2025-08-01'));
        $result = new SurveyResult('passed');
        $entity = new Survey(
            surveyId: new SurveyId(1),
            date: $date,
            result: $result,
            userId: new UserId(10),
            followUpFileId: new FollowUpFileId(20),
            createdAt: Carbon::now(),
            updatedAt: Carbon::now(),
        );

        $this->assertSame('PASSED', $entity->getResult()->getValue());
        $this->assertSame('2025-08-01', $entity->getDate()->getValue()->toDateString());
    $this->assertSame('10', $entity->getUserId()->getValue());
        $this->assertSame(20, $entity->getFollowUpFileId()->getValue());
        $this->assertIsArray($entity->toArray());
    }

    public function test_create_survey_use_case()
    {
        $dto = new CreateSurveyDTO(
            date: '2025-08-01',
            result: 'PENDING',
            userId: 10,
            followUpFileId: 20,
        );

        $expected = new Survey(
            surveyId: new SurveyId(1),
            date: $dto->getDateVO(),
            result: $dto->getResultVO(),
            userId: new UserId(10),
            followUpFileId: new FollowUpFileId(20),
        );

        $repo = $this->createMock(SurveyRepositoryInterface::class);
        $repo->method('save')->willReturn($expected);

        $uc = new CreateSurveyUseCase($repo);
        $out = $uc->execute($dto);
        $this->assertSame($expected, $out);
    }

    public function test_get_survey_use_case_found_and_not_found()
    {
        $repo = $this->createMock(SurveyRepositoryInterface::class);
        $repo->method('findById')->willReturnCallback(function ($id) {
            if ($id instanceof SurveyId && $id->getValue() === 1) {
                return new Survey(
                    surveyId: new SurveyId(1),
                    date: new SurveyDate(Carbon::parse('2025-08-01')),
                    result: new SurveyResult('PENDING'),
                    userId: new UserId(10),
                    followUpFileId: new FollowUpFileId(20),
                );
            }
            return null;
        });

        $uc = new GetSurveyUseCase($repo);
        $found = $uc->execute(1);
        $this->assertInstanceOf(Survey::class, $found);

        $this->expectException(RuntimeException::class);
        $uc->execute(999);
    }

    public function test_update_survey_use_case()
    {
        $existing = new Survey(
            surveyId: new SurveyId(1),
            date: new SurveyDate(Carbon::parse('2025-08-01')),
            result: new SurveyResult('PENDING'),
            userId: new UserId(10),
            followUpFileId: new FollowUpFileId(20),
        );

        $updated = new Survey(
            surveyId: new SurveyId(1),
            date: new SurveyDate(Carbon::parse('2025-08-02')),
            result: new SurveyResult('PASSED'),
            userId: new UserId(10),
            followUpFileId: new FollowUpFileId(20),
        );

        $repo = $this->createMock(SurveyRepositoryInterface::class);
        $repo->method('findById')->willReturn($existing);
        $repo->method('save')->willReturn($updated);

        $uc = new UpdateSurveyUseCase($repo);
        $out = $uc->execute(new UpdateSurveyDTO(1, '2025-08-02', 'PASSED'));
        $this->assertSame($updated, $out);
    }

    public function test_delete_survey_use_case()
    {
        $repo = $this->createMock(SurveyRepositoryInterface::class);
        $repo->method('findById')->willReturn(new Survey(
            surveyId: new SurveyId(1),
            date: new SurveyDate(Carbon::parse('2025-08-01')),
            result: new SurveyResult('PENDING'),
            userId: new UserId(10),
            followUpFileId: new FollowUpFileId(20),
        ));
        $repo->method('delete')->willReturn(true);

        $uc = new DeleteSurveyUseCase($repo);
        $this->assertTrue($uc->execute(1));
    }
}
