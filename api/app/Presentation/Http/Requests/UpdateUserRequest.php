<?php

namespace App\Presentation\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
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
            'email' => [
                'sometimes',
                'string',
                'email',
                'max:255',
                // Unique if provided; ignore current user id
                'unique:users,email,' . $this->route('userId') . ',user_id',
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
                // Unique if provided; ignore current user id
                'unique:users,phone,' . $this->route('userId') . ',user_id',
            ],
            'role_id' => [
                'sometimes',
                'integer',
                'exists:roles,role_id',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'full_name.max' => 'Full name must not exceed 50 characters.',
            'email.email' => 'Email is not valid.',
            'email.max' => 'Email must be less than 255 characters.',
            'email.unique' => 'Email is already taken.',
            'avatar.max' => 'Avatar path must not exceed 255 characters.',
            'phone.max' => 'Phone number must not exceed 20 characters.',
            'phone.regex' => 'Phone number format is invalid.',
            'phone.unique' => 'Phone number is already taken.',
            'role_id.integer' => 'Role ID must be an integer.',
            'role_id.exists' => 'Role does not exist.',
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
