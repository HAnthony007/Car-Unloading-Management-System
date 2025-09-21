<?php

namespace App\Presentation\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class BatchStoreDischargePhotosRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'files' => ['required', 'array', 'min:1'],
            'files.*' => ['required', 'file', 'mimetypes:image/jpeg,image/png,image/gif,image/webp,image/svg+xml', 'max:10240'],
            // Optional metadata applied to all files in this batch
            'taken_at' => ['sometimes', 'date'],
            'photo_description' => ['sometimes', 'nullable', 'string'],
            'checkpoint_id' => ['sometimes', 'nullable', 'integer', 'exists:survey_checkpoints,checkpoint_id'],
            'visibility' => ['sometimes', 'in:public,private'],
        ];
    }

    public function messages(): array
    {
        return [
            'files.required' => 'At least one image file is required.',
            'files.array' => 'Files must be provided as an array.',
            'files.min' => 'Provide at least one file.',
            'files.*.file' => 'Invalid file provided.',
            'files.*.mimetypes' => 'Unsupported image type. Allowed: jpeg,png,gif,webp,svg.',
            'files.*.max' => 'Each image is too large (max 10MB).',
        ];
    }

    protected function failedValidation(Validator $validator): void
    {
        throw new HttpResponseException(
            response()->json(['errors' => $validator->errors()], 422)
        );
    }
}
