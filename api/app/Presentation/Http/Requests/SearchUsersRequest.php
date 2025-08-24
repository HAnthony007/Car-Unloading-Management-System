<?php

namespace App\Presentation\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

final class SearchUsersRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'matriculation_prefix' => [
                'sometimes',
                'nullable',
                'string',
                'max:10',
            ],
            'role_id' => [
                'sometimes',
                'nullable',
                'integer',
                'exists:roles,role_id',
            ],
            'email_verified' => [
                'sometimes',
                'nullable',
                'boolean',
            ],
            'is_active' => [
                'sometimes',
                'nullable',
                'boolean',
            ],
            'search_term' => [
                'sometimes',
                'nullable',
                'string',
                'max:100',
            ],
            'page' => [
                'sometimes',
                'integer',
                'min:1',
            ],
            'per_page' => [
                'sometimes',
                'integer',
                'min:1',
                'max:100',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'matriculation_prefix.max' => 'Matriculation prefix must not exceed 10 characters.',
            'role_id.exists' => 'Selected role does not exist.',
            'page.min' => 'Page number must be at least 1.',
            'per_page.min' => 'Per page must be at least 1.',
            'per_page.max' => 'Per page must not exceed 100.',
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
