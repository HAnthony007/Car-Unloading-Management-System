<?php

namespace App\Presentation\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class UploadPhotoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'file' => ['required', 'file', 'mimetypes:image/jpeg,image/png,image/gif,image/webp,image/svg+xml', 'max:5120'],
            // Optional: override R2 directory and visibility
            'directory' => ['sometimes', 'string'],
            'visibility' => ['sometimes', 'in:public,private'],
        ];
    }

    public function messages(): array
    {
        return [
            'file.required' => 'A file is required.',
            'file.file' => 'Invalid file upload.',
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
