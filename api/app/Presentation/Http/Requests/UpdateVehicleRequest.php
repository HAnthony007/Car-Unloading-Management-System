<?php

namespace App\Presentation\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

final class UpdateVehicleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'make' => ['sometimes', 'string', 'max:255'],
            'model' => ['sometimes', 'string', 'max:255'],
            'year' => ['sometimes', 'nullable', 'integer', 'digits:4', 'min:1900', 'max:'.((int) date('Y') + 1)],
            'owner_name' => ['sometimes', 'nullable', 'string', 'max:255'],
            'color' => ['sometimes', 'nullable', 'string', 'max:255'],
            'type' => ['sometimes', 'string', 'max:255'],
            'weight' => ['sometimes', 'string', 'max:255'],
            'vehicle_condition' => ['sometimes', 'string', 'max:255'],
            'vehicle_observation' => ['sometimes', 'nullable', 'string', 'max:1000'],
            'origin_country' => ['sometimes', 'string', 'max:255'],
            'ship_location' => ['sometimes', 'nullable', 'string', 'max:255'],
            'is_primed' => ['sometimes', 'boolean'],
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
