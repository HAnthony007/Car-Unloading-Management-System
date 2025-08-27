<?php

namespace App\Presentation\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePhotoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'photo_path' => ['nullable', 'string', 'max:1024'],
            'taken_at' => ['nullable', 'date'],
            'photo_description' => ['nullable', 'string'],
            'follow_up_file_id' => ['nullable', 'integer', 'exists:follow_up_files,follow_up_file_id'],
            'vehicle_id' => ['nullable', 'integer', 'exists:vehicles,vehicle_id'],
            'checkpoint_id' => ['nullable', 'integer', 'exists:survey_checkpoints,checkpoint_id'],
        ];
    }
}
