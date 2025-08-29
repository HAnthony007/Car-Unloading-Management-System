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
            // XOR: require one and only one of follow_up_file_id or checkpoint_id
            'follow_up_file_id' => ['nullable', 'integer', 'exists:follow_up_files,follow_up_file_id', 'required_without:checkpoint_id', 'prohibits:checkpoint_id'],
            // vehicle_id removed from Photo
            'checkpoint_id' => ['nullable', 'integer', 'exists:survey_checkpoints,checkpoint_id', 'required_without:follow_up_file_id', 'prohibits:follow_up_file_id'],
        ];
    }

    public function messages(): array
    {
        return [
            'follow_up_file_id.required_without' => 'Provide either follow_up_file_id or checkpoint_id.',
            'checkpoint_id.required_without' => 'Provide either follow_up_file_id or checkpoint_id.',
            'follow_up_file_id.prohibits' => 'Provide either follow_up_file_id or checkpoint_id, not both.',
            'checkpoint_id.prohibits' => 'Provide either follow_up_file_id or checkpoint_id, not both.',
        ];
    }
}
