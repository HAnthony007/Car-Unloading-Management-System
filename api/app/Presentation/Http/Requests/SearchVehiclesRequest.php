<?php

namespace App\Presentation\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

final class SearchVehiclesRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'vin' => ['sometimes', 'string', 'max:255'],
            'discharge_id' => ['sometimes', 'integer', 'exists:discharges,discharge_id'],
            'make' => ['sometimes', 'string', 'max:255'],
            'model' => ['sometimes', 'string', 'max:255'],
            'page' => ['sometimes', 'integer', 'min:1'],
            'per_page' => ['sometimes', 'integer', 'min:1', 'max:100'],
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
