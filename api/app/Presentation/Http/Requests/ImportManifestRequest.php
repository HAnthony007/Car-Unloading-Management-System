<?php

namespace App\Presentation\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ImportManifestRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null; // require auth via route middleware
    }

    public function rules(): array
    {
        return [
            'file' => ['required', 'file', 'mimes:xlsx,xls'],
        ];
    }
}
