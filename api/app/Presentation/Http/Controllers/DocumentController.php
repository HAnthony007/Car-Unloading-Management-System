<?php

namespace App\Presentation\Http\Controllers;

use App\Application\Document\DTOs\CreateDocumentDTO;
use App\Application\Document\DTOs\DocumentSearchCriteriaDTO;
use App\Application\Document\DTOs\UpdateDocumentDTO;
use App\Application\Document\UseCases\CreateDocumentUseCase;
use App\Application\Document\UseCases\DeleteDocumentUseCase;
use App\Application\Document\UseCases\GetDocumentUseCase;
use App\Application\Document\UseCases\SearchDocumentsUseCase;
use App\Application\Document\UseCases\UpdateDocumentUseCase;
use App\Domain\Document\Services\DocumentStorageService;
use App\Presentation\Http\Requests\SearchDocumentsRequest;
use App\Presentation\Http\Requests\StoreDocumentRequest;
use App\Presentation\Http\Requests\UpdateDocumentRequest;
use App\Presentation\Http\Resources\DomainDocumentResource;
use Illuminate\Http\JsonResponse;

final class DocumentController extends Controller
{
    public function __construct(
        private readonly CreateDocumentUseCase $createUseCase,
        private readonly GetDocumentUseCase $getUseCase,
        private readonly SearchDocumentsUseCase $searchUseCase,
        private readonly UpdateDocumentUseCase $updateUseCase,
        private readonly DeleteDocumentUseCase $deleteUseCase,
        private readonly DocumentStorageService $storage,
    ) {}

    public function index(SearchDocumentsRequest $request): JsonResponse
    {
        $criteria = DocumentSearchCriteriaDTO::fromArray($request->validated());
        $result = $this->searchUseCase->execute($criteria);

        return response()->json([
            'data' => DomainDocumentResource::collection($result['data']),
            'meta' => [
                'current_page' => $result['current_page'],
                'from' => $result['from'],
                'last_page' => $result['last_page'],
                'path' => $result['path'],
                'per_page' => $result['per_page'],
                'to' => $result['to'],
                'total' => $result['total'],
            ],
        ]);
    }

    public function store(StoreDocumentRequest $request): JsonResponse
    {
        try {
            $data = $request->validated();
            if ($request->hasFile('file')) {
                $file = $request->file('file');
                $contents = file_get_contents($file->getRealPath());
                $ext = $file->getClientOriginalExtension() ?: $file->extension();
                $storedPath = $this->storage->store($contents, $ext);
                $data['document_path'] = $storedPath;
            }

            $dto = CreateDocumentDTO::fromArray($data);
            $entity = $this->createUseCase->execute($dto);

            return response()->json([
                'message' => 'Document created successfully.',
                'data' => new DomainDocumentResource($entity),
            ], 201);
        } catch (\Throwable $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    public function show(int $id): JsonResponse
    {
        try {
            $entity = $this->getUseCase->execute($id);

            return response()->json(['data' => new DomainDocumentResource($entity)]);
        } catch (\Throwable $e) {
            return response()->json(['error' => $e->getMessage()], 404);
        }
    }

    public function update(UpdateDocumentRequest $request, int $id): JsonResponse
    {
        try {
            $data = $request->validated();
            if ($request->hasFile('file')) {
                $file = $request->file('file');
                $contents = file_get_contents($file->getRealPath());
                $ext = $file->getClientOriginalExtension() ?: $file->extension();
                $storedPath = $this->storage->store($contents, $ext);
                $data['document_path'] = $storedPath;
            }
            $data['document_id'] = $id;
            $dto = UpdateDocumentDTO::fromArray($data);
            $entity = $this->updateUseCase->execute($dto);

            return response()->json([
                'message' => 'Document updated successfully.',
                'data' => new DomainDocumentResource($entity),
            ]);
        } catch (\Throwable $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    public function destroy(int $id): JsonResponse
    {
        try {
            $this->deleteUseCase->execute($id);

            return response()->json(['message' => 'Document deleted successfully.']);
        } catch (\Throwable $e) {
            return response()->json(['error' => $e->getMessage()], 404);
        }
    }
}
