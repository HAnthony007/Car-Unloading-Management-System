<?php

namespace App\Presentation\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SearchFollowUpFilesRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'bill_of_lading' => ['sometimes', 'string', 'max:255'],
            'status' => ['sometimes', 'in:OPEN,IN_PROGRESS,CLOSED,PENDING'],
            'vehicle_id' => ['sometimes', 'integer'],
            'port_call_id' => ['sometimes', 'integer'],
            'page' => ['sometimes', 'integer', 'min:1'],
            'per_page' => ['sometimes', 'integer', 'min:1', 'max:100'],
        ];
    }
}
