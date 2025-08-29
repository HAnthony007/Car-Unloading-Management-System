<?php

namespace App\Presentation\Http\Controllers;

use App\Models\FollowUpFile;
use App\Models\Photo as EloquentPhoto;
use App\Presentation\Http\Requests\StoreFollowUpFilePhotoRequest;
use Illuminate\Http\JsonResponse;

final class FollowUpFilePhotoController extends Controller
{
    /**
     * Create a new photo for a FollowUpFile and upload the file to storage.
     */
    public function store(StoreFollowUpFilePhotoRequest $request, int $followUpFileId): JsonResponse
    {
        $fuf = FollowUpFile::query()->find($followUpFileId);
        if (! $fuf) {
            return response()->json(['error' => 'FollowUpFile not found.'], 404);
        }

        $checkpointId = $request->has('checkpoint_id') ? (int) $request->integer('checkpoint_id') : null;

        // First create the photo record (path will be set after upload)
        $photo = new EloquentPhoto([
            'photo_path' => '',
            'taken_at' => $request->date('taken_at')?->toDateTimeString() ?? now(),
            'photo_description' => $request->string('photo_description')->toString() ?: null,
            'follow_up_file_id' => $fuf->follow_up_file_id,
            'checkpoint_id' => $checkpointId,
        ]);
        $photo->save();

        // Upload file to storage under inferred directory: photos/follow-up/{id}
        $file = $request->file('file');
        $visibility = $request->string('visibility')->toString() ?: 'public';
        $photo->storeUploadedPhoto($file, null, $visibility);
        $photo->save();

        return response()->json([
            'message' => 'Photo created and uploaded successfully.',
            'data' => [
                'photo_id' => $photo->photo_id,
                'photo_path' => $photo->photo_path,
                'url' => $photo->photoUrl(),
                'follow_up_file_id' => $photo->follow_up_file_id,
                'checkpoint_id' => $photo->checkpoint_id,
            ],
        ], 201);
    }
}
