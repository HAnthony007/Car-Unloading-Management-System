<?php

namespace App\Presentation\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SearchPhotosRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'discharge_id' => ['nullable', 'integer', 'exists:discharges,discharge_id'],
            'survey_id' => ['nullable', 'integer', 'exists:surveys,survey_id'],
            'checkpoint_id' => ['nullable', 'integer', 'exists:survey_checkpoints,checkpoint_id'],
            'from_date' => ['nullable', 'date'],
            'to_date' => ['nullable', 'date'],
            'page' => ['nullable', 'integer', 'min:1'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
        ];
    }
}
