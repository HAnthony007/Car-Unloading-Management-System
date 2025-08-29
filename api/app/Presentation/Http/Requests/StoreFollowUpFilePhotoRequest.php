<?php

namespace App\Presentation\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class StoreFollowUpFilePhotoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'file' => ['required', 'file', 'mimetypes:image/jpeg,image/png,image/gif,image/webp,image/svg+xml', 'max:5120'],
            'taken_at' => ['sometimes', 'date'],
            'photo_description' => ['sometimes', 'nullable', 'string'],
            'checkpoint_id' => ['sometimes', 'nullable', 'integer', 'exists:survey_checkpoints,checkpoint_id'],
            'visibility' => ['sometimes', 'in:public,private'],
        ];
    }

    public function messages(): array
    {
        return [
            'file.required' => 'An image file is required.',
            'file.mimetypes' => 'Unsupported image type. Allowed: jpeg,png,gif,webp,svg.',
            'file.max' => 'Image is too large (max 5MB).',
        ];
    }

    protected function failedValidation(Validator $validator): void
    {
        throw new HttpResponseException(
            response()->json(['errors' => $validator->errors()], 422)
        );
    }
}
