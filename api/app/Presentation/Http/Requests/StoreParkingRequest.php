<?php

namespace App\Presentation\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

final class StoreParkingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'parking_name' => [
                'required',
                'string',
                'max:100',
            ],
            'location' => [
                'required',
                'string',
                'max:255',
            ],
            'capacity' => [
                'required',
                'integer',
                'min:0',
                'max:10000',
            ],
            'parking_number' => [
                'nullable',
                'string',
                'max:50',
                function ($attribute, $value, $fail) {
                    if ($this->input('parking_name') === 'Mahasarika' && empty($value)) {
                        $fail('Parking number is required for Mahasarika parking.');
                    }
                },
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'parking_name.required' => 'Parking name is required.',
            'parking_name.string' => 'Parking name must be a valid string.',
            'parking_name.max' => 'Parking name cannot exceed 100 characters.',
            'location.required' => 'Location is required.',
            'location.string' => 'Location must be a valid string.',
            'location.max' => 'Location cannot exceed 255 characters.',
            'capacity.required' => 'Capacity is required.',
            'capacity.integer' => 'Capacity must be a valid integer.',
            'capacity.min' => 'Capacity cannot be negative.',
            'capacity.max' => 'Capacity cannot exceed 10000.',
            'parking_number.string' => 'Parking number must be a valid string.',
            'parking_number.max' => 'Parking number cannot exceed 50 characters.',
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
