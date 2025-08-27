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
            'photo_path' => ['required', 'string', 'max:1024'],
            'taken_at' => ['required', 'date'],
            'photo_description' => ['nullable', 'string'],
            'follow_up_file_id' => ['required', 'integer', 'exists:follow_up_files,follow_up_file_id'],
            'vehicle_id' => ['required', 'integer', 'exists:vehicles,vehicle_id'],
            'checkpoint_id' => ['required', 'integer', 'exists:survey_checkpoints,checkpoint_id'],
        ];
    }
}
