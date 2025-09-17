<?php

namespace App\Presentation\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

final class UpdateMovementRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'note' => ['nullable', 'string', 'max:1000'],
            'timestamp' => ['nullable', 'date'],
            'from' => ['nullable', 'string', 'max:255'],
            'to' => ['nullable', 'string', 'max:255'],
            'from_latitude' => ['sometimes', 'nullable', 'numeric', 'between:-90,90'],
            'from_longitude' => ['sometimes', 'nullable', 'numeric', 'between:-180,180'],
            'to_latitude' => ['sometimes', 'nullable', 'numeric', 'between:-90,90'],
            'to_longitude' => ['sometimes', 'nullable', 'numeric', 'between:-180,180'],
            'parking_number' => ['nullable', 'string', 'max:50', 'required_if:to,Mahasarika'],
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
