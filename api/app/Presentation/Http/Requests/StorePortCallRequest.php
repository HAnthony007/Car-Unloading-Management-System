<?php

namespace App\Presentation\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class StorePortCallRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'vessel_agent' => ['required', 'string', 'max:255'],
            'origin_port' => ['required', 'string', 'max:255'],
            'estimated_arrival' => ['nullable', 'date'],
            'arrival_date' => ['required', 'date'],
            'estimated_departure' => ['nullable', 'date'],
            'departure_date' => ['nullable', 'date', 'after_or_equal:arrival_date'],
            'vessel_id' => ['required', 'integer', 'exists:vessels,vessel_id'],
            'dock_id' => ['required', 'integer', 'exists:docks,dock_id'],
            'status' => ['sometimes', 'nullable', 'in:pending,in_progress,completed'],
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
