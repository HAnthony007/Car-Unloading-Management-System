<?php

namespace App\Presentation\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class UploadAvatarRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'avatar' => 'required|mimetypes:image/jpeg,image/png,image/gif,image/webp,image/svg+xml|max:5120',
        ];
    }

    public function messages(): array
    {
        return [
            'avatar.required' => 'Avatar is required.',
            'avatar.image' => 'Avatar must be an image.',
            'avatar.mimes' => 'Avatar must be a JPEG, PNG, GIF, WEBP or SVG file.',
            'avatar.max' => 'Avatar must be less than 5MB.',
        ];
    }

    protected function failedValidation(Validator $validator): void
    {
        $errors = $validator->errors()->messages();
        $response = response()->json([
            'message' => 'Validation failed.',
            'errors' => $errors,
        ], 422);
        throw new HttpResponseException($response);
    }
}
