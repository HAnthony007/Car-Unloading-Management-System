<?php

namespace App\Presentation\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class UpdatePortCallRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'vessel_agent' => ['sometimes', 'string', 'max:255'],
            'origin_port' => ['sometimes', 'string', 'max:255'],
            'estimated_arrival' => ['sometimes', 'nullable', 'date'],
            'arrival_date' => ['sometimes', 'nullable', 'date'],
            'estimated_departure' => ['sometimes', 'nullable', 'date'],
            'departure_date' => ['sometimes', 'nullable', 'date'],
            'vessel_id' => ['sometimes', 'integer', 'exists:vessels,vessel_id'],
            'dock_id' => ['sometimes', 'integer', 'exists:docks,dock_id'],
        ];
    }

    protected function failedValidation(Validator $validator): void
    {
        $response = response()->json([
            'message' => 'Validation failed.',
            'errors' => $validator->errors()->messages(),
        ], 422);
        throw new HttpResponseException($response);
    }
}
