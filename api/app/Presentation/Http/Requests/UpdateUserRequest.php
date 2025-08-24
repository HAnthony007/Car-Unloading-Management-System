<?php

namespace App\Presentation\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

final class UpdateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'full_name' => [
                'sometimes',
                'string',
                'max:50',
            ],
            'avatar' => [
                'sometimes',
                'nullable',
                'string',
                'max:255',
            ],
            'phone' => [
                'sometimes',
                'nullable',
                'string',
                'max:20',
                'regex:/^[0-9+\-\s\(\)]+$/',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'full_name.max' => 'Full name must not exceed 50 characters.',
            'avatar.max' => 'Avatar path must not exceed 255 characters.',
            'phone.max' => 'Phone number must not exceed 20 characters.',
            'phone.regex' => 'Phone number format is invalid.',
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
