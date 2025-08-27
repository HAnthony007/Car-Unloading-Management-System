<?php

namespace App\Presentation\Http\Controllers;

use App\Application\Survey\DTOs\CreateSurveyDTO;
use App\Application\Survey\DTOs\SurveySearchCriteriaDTO;
use App\Application\Survey\DTOs\UpdateSurveyDTO;
use App\Application\Survey\UseCases\CreateSurveyUseCase;
use App\Application\Survey\UseCases\DeleteSurveyUseCase;
use App\Application\Survey\UseCases\GetSurveyUseCase;
use App\Application\Survey\UseCases\SearchSurveysUseCase;
use App\Application\Survey\UseCases\UpdateSurveyUseCase;
use App\Presentation\Http\Requests\CreateSurveyRequest;
use App\Presentation\Http\Requests\SearchSurveysRequest;
use App\Presentation\Http\Requests\UpdateSurveyRequest;
use App\Presentation\Http\Resources\SurveyResource;
use Illuminate\Http\JsonResponse;

final class SurveyController extends Controller
{
    public function __construct(
        private readonly CreateSurveyUseCase $createSurveyUseCase,
        private readonly DeleteSurveyUseCase $deleteSurveyUseCase,
        private readonly GetSurveyUseCase $getSurveyUseCase,
        private readonly SearchSurveysUseCase $searchSurveysUseCase,
        private readonly UpdateSurveyUseCase $updateSurveyUseCase,
    ) {}

    public function index(SearchSurveysRequest $request): JsonResponse
    {
        try {
            $criteria = SurveySearchCriteriaDTO::fromArray($request->validated());
            $surveys = $this->searchSurveysUseCase->execute($criteria);

            return response()->json([
                'data' => SurveyResource::collection($surveys['data']),
                'meta' => [
                    'current_page' => $surveys['current_page'],
                    'from' => $surveys['from'],
                    'last_page' => $surveys['last_page'],
                    'path' => $surveys['path'],
                    'per_page' => $surveys['per_page'],
                    'to' => $surveys['to'],
                    'total' => $surveys['total'],
                ],
            ]);
        } catch (\Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 400);
        }
    }

    public function store(CreateSurveyRequest $request): JsonResponse
    {
        try {
            $dto = CreateSurveyDTO::fromArray($request->validated());
            $survey = $this->createSurveyUseCase->execute($dto);

            return response()->json([
                'message' => 'Survey created successfully.',
                'data' => new SurveyResource($survey),
            ], 201);
        } catch (\Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 400);
        }
    }

    public function show(int $id): JsonResponse
    {
        try {
            $survey = $this->getSurveyUseCase->execute($id);

            return response()->json(['data' => new SurveyResource($survey)]);
        } catch (\Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 404);
        }
    }

    public function update(UpdateSurveyRequest $request, int $id): JsonResponse
    {
        try {
            $data = $request->validated();
            $data['survey_id'] = $id;
            $dto = UpdateSurveyDTO::fromArray($data);
            $survey = $this->updateSurveyUseCase->execute($dto);

            return response()->json([
                'message' => 'Survey updated successfully.',
                'data' => new SurveyResource($survey),
            ], 200);
        } catch (\Exception $exception) {
            $statusCode = $exception->getMessage() === 'Survey not found.' ? 404 : 400;

            return response()->json(['error' => $exception->getMessage()], $statusCode);
        }
    }

    public function destroy(int $id): JsonResponse
    {
        try {
            $this->deleteSurveyUseCase->execute($id);

            return response()->json(['message' => 'Survey deleted successfully.'], 200);
        } catch (\Exception $exception) {
            $statusCode = $exception->getMessage() === 'Survey not found.' ? 404 : 400;

            return response()->json(['error' => $exception->getMessage()], $statusCode);
        }
    }
}
