<?php

namespace App\Presentation\Http\Controllers;

use App\Application\User\UseCases\ManageUserAvatarUserCase;
use App\Presentation\Http\Requests\UploadAvatarRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class UserAvatarController extends Controller
{
    public function __construct(
        private readonly ManageUserAvatarUserCase $manageUserAvatarUserCase,
    ) {}

    public function upload(UploadAvatarRequest $request, int $userId): JsonResponse
    {
        try {
            $avatarPath = $this->manageUserAvatarUserCase->uploadAvatar(
                $userId,
                $request->file('avatar')
            );

            // Also produce a URL (non-temporary) for convenience
            $avatarUrl = $this->manageUserAvatarUserCase->getAvatar($userId);

            return response()->json([
                'message' => 'Avatar uploaded successfully.',
                'data' => [
                    'path' => $avatarPath,
                    'url' => $avatarUrl,
                ],
            ], 201);
        } catch (\Exception $exception) {
            return response()->json([
                'error' => $exception->getMessage(),
            ], 400);
        }
    }

    public function delete(int $userId): JsonResponse
    {
        try {
            $success = $this->manageUserAvatarUserCase->deleteAvatar($userId);

            return response()->json([
                'message' => 'Avatar deleted successfully.',
                'data' => [
                    'success' => $success,
                ],
            ], 200);
        } catch (\Exception $exception) {
            return response()->json([
                'error' => $exception->getMessage(),
            ], 400);
        }
    }

    public function getUrl(Request $request, int $userId): JsonResponse
    {
        try {
            $temporary = $request->boolean('temporary', false);
            $url = $this->manageUserAvatarUserCase->getAvatar($userId, $temporary);

            return response()->json([
                'message' => 'Avatar URL retrieved successfully.',
                'data' => [
                    'url' => $url,
                ],
            ], 200);
        } catch (\Exception $exception) {
            return response()->json([
                'error' => $exception->getMessage(),
            ], 400);
        }
    }
}
