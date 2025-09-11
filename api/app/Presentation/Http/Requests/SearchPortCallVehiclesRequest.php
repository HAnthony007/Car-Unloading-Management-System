<?php

namespace App\Presentation\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SearchPortCallVehiclesRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // adapter selon auth/policies
    }

    public function rules(): array
    {
        return [
            'vin' => ['sometimes','string','max:50'],
            'make' => ['sometimes','string','max:100'],
            'model' => ['sometimes','string','max:100'],
            'owner_name' => ['sometimes','string','max:150'],
            'color' => ['sometimes','string','max:50'],
            'type' => ['sometimes','string','max:100'],
            'origin_country' => ['sometimes','string','max:100'],
            'search_term' => ['sometimes','string','max:150'],
            'page' => ['sometimes','integer','min:1'],
            'per_page' => ['sometimes','integer','min:1','max:100'],
        ];
    }
}