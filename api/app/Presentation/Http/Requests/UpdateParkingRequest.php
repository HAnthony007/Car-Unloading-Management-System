<?php

namespace App\Presentation\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

final class UpdateParkingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'parking_name' => [
                'sometimes',
                'string',
                'max:100',
            ],
            'location' => [
                'sometimes',
                'string',
                'max:255',
            ],
            'capacity' => [
                'sometimes',
                'integer',
                'min:0',
                'max:10000',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'parking_name.string' => 'Parking name must be a valid string.',
            'parking_name.max' => 'Parking name cannot exceed 100 characters.',
            'location.string' => 'Location must be a valid string.',
            'location.max' => 'Location cannot exceed 255 characters.',
            'capacity.integer' => 'Capacity must be a valid integer.',
            'capacity.min' => 'Capacity cannot be negative.',
            'capacity.max' => 'Capacity cannot exceed 10000.',
        ];
    }

    /**
     * Return a JSON response when validation fails.
     */
    protected function failedValidation(Validator $validator): void
    {
        $errors = $validator->errors()->messages();

        $response = response()->json([
            'message' => 'Validation failed.',
            'errors' => $errors,
        ], 422);

        throw new HttpResponseException($response);
    }
}
