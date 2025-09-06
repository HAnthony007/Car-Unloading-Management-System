<?php

namespace App\Presentation\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreDocumentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'document_path' => ['required_without:file', 'string', 'max:2048'],
            'file' => ['required_without:document_path', 'file', 'max:10240', 'mimetypes:application/pdf,image/png,image/jpeg,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
            'document_description' => ['nullable', 'string'],
            'type' => ['required', 'string', 'max:255'],
            'uploaded_at' => ['required', 'date'],
            'follow_up_file_id' => ['required', 'integer', 'exists:follow_up_files,follow_up_file_id'],
            'port_call_id' => ['required', 'integer', 'exists:port_calls,port_call_id'],
        ];
    }
}
