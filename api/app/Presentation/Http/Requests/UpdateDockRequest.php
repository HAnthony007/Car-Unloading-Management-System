<?php

namespace App\Presentation\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

final class UpdateDockRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'dock_name' => ['sometimes', 'string', 'max:100'],
            'location' => ['sometimes', 'string', 'max:255'],
        ];
    }

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
