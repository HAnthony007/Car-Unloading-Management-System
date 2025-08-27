<?php

namespace App\Presentation\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateDocumentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'document_path' => ['nullable', 'string', 'max:2048'],
            'file' => ['sometimes', 'file', 'max:10240', 'mimetypes:application/pdf,image/png,image/jpeg,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
            'document_description' => ['nullable', 'string'],
            'type' => ['nullable', 'string', 'max:255'],
            'uploaded_at' => ['nullable', 'date'],
            'follow_up_file_id' => ['nullable', 'integer', 'exists:follow_up_files,follow_up_file_id'],
        ];
    }
}
