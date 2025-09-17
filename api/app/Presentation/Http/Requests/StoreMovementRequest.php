<?php

namespace App\Presentation\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

final class StoreMovementRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'note' => ['nullable', 'string', 'max:1000'],
            'timestamp' => ['required', 'date'],
            'from' => ['nullable', 'string', 'max:255'],
            'to' => ['nullable', 'string', 'max:255'],
            'from_latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'from_longitude' => ['nullable', 'numeric', 'between:-180,180'],
            'to_latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'to_longitude' => ['nullable', 'numeric', 'between:-180,180'],
            // parking_number is per-discharge slot; required when destination is Mahasarika
            'parking_number' => ['nullable', 'string', 'max:50', 'required_if:to,Mahasarika'],
            'discharge_id' => ['required', 'integer'],
            'user_id' => ['required', 'integer'],
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
