<?php

namespace App\Presentation\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePhotoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'photo_path' => ['nullable', 'string', 'max:1024'],
            'taken_at' => ['required', 'date'],
            'photo_description' => ['nullable', 'string'],
            'discharge_id' => ['required', 'integer', 'exists:discharges,discharge_id'],
            'survey_id' => ['nullable', 'integer', 'exists:surveys,survey_id'],
            'checkpoint_id' => ['nullable', 'integer', 'exists:survey_checkpoints,checkpoint_id'],
        ];
    }

    public function messages(): array
    {
        return [
            // Legacy messages removed; using direct required discharge_id now
            'discharge_id.required' => 'discharge_id is required.',
        ];
    }
}
