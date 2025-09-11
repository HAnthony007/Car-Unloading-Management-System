<?php

namespace App\Presentation\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SearchPortCallsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Adapter selon auth/policies si nécessaire
    }

    public function rules(): array
    {
        return [
            'vessel_agent' => ['sometimes','string','max:255'],
            'origin_port' => ['sometimes','string','max:255'],
            'status' => ['sometimes','string','in:pending,in_progress,completed'],
            'search_term' => ['sometimes','string','max:255'],
            'arrival_from' => ['sometimes','date'],
            'arrival_to' => ['sometimes','date','after_or_equal:arrival_from'],
            'page' => ['sometimes','integer','min:1'],
            'per_page' => ['sometimes','integer','min:1','max:100'],
        ];
    }
}
