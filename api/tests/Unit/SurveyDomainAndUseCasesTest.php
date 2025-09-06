<?php

use App\Application\Survey\DTOs\CreateSurveyDTO;
use App\Application\Survey\DTOs\UpdateSurveyDTO;
use App\Application\Survey\UseCases\CreateSurveyUseCase;
use App\Application\Survey\UseCases\DeleteSurveyUseCase;
use App\Application\Survey\UseCases\GetSurveyUseCase;
use App\Application\Survey\UseCases\UpdateSurveyUseCase;
use App\Domain\Discharge\ValueObjects\DischargeId;
use App\Domain\Survey\Entities\Survey;
use App\Domain\Survey\Repositories\SurveyRepositoryInterface;
use App\Domain\Survey\ValueObjects\SurveyDate;
use App\Domain\Survey\ValueObjects\SurveyId;
use App\Domain\Survey\ValueObjects\SurveyStatus; // agent
use App\Domain\User\ValueObjects\UserId;
use Carbon\Carbon;
use PHPUnit\Framework\TestCase;

class SurveyDomainAndUseCasesTest extends TestCase
{
    public function test_value_objects_and_entity()
    {
        $date = new SurveyDate(Carbon::parse('2025-08-01T09:30:00Z'));
        $status = new SurveyStatus('PASSED');
        $entity = new Survey(
            surveyId: new SurveyId(1),
            surveyDate: $date,
            overallStatus: $status,
            agentId: new UserId(10),
            dischargeId: new DischargeId(55),
            createdAt: Carbon::now(),
            updatedAt: Carbon::now(),
        );

        $this->assertSame('PASSED', $entity->getOverallStatus()->getValue());
        $this->assertSame('2025-08-01', $entity->getSurveyDate()->getValue()->toDateString());
        $this->assertSame(10, $entity->getAgentId()->getValue());
        $this->assertSame(55, $entity->getDischargeId()->getValue());
        $this->assertIsArray($entity->toArray());
    }

    public function test_create_survey_use_case()
    {
        $dto = new CreateSurveyDTO(
            surveyDate: '2025-08-01 00:00:00',
            overallStatus: 'PENDING',
            agentId: 10,
            dischargeId: 55,
        );

        $expected = new Survey(
            surveyId: new SurveyId(1),
            surveyDate: $dto->getSurveyDateVO(),
            overallStatus: $dto->getStatusVO(),
            agentId: new UserId(10),
            dischargeId: new DischargeId(55),
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
                    surveyDate: new SurveyDate(Carbon::parse('2025-08-01')),
                    overallStatus: new SurveyStatus('PENDING'),
                    agentId: new UserId(10),
                    dischargeId: new DischargeId(55),
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
            surveyDate: new SurveyDate(Carbon::parse('2025-08-01')),
            overallStatus: new SurveyStatus('PENDING'),
            agentId: new UserId(10),
            dischargeId: new DischargeId(55),
        );

        $updated = new Survey(
            surveyId: new SurveyId(1),
            surveyDate: new SurveyDate(Carbon::parse('2025-08-02')),
            overallStatus: new SurveyStatus('PASSED'),
            agentId: new UserId(10),
            dischargeId: new DischargeId(55),
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
            surveyDate: new SurveyDate(Carbon::parse('2025-08-01')),
            overallStatus: new SurveyStatus('PENDING'),
            agentId: new UserId(10),
            dischargeId: new DischargeId(55),
        ));
        $repo->method('delete')->willReturn(true);

        $uc = new DeleteSurveyUseCase($repo);
        $this->assertTrue($uc->execute(1));
    }
}
