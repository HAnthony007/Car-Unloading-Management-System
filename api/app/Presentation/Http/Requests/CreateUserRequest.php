<?php

namespace App\Presentation\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

final class CreateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'matriculation_no' => [
                'required',
                'string',
                'max:50',
                'unique:users,matriculation_no',
                'regex:/^[A-Z0-9-]+$/',
            ],
            'full_name' => [
                'required',
                'string',
                'max:50',
            ],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                'unique:users,email',
            ],
            'password' => [
                'required',
                'string',
                'min:8',
                'confirmed',
            ],
            'avatar' => [
                'sometimes',
                'string',
                'max:255',
            ],
            'phone' => [
                'sometimes',
                'nullable',
                'string',
                'max:20',
            ],
            'role_id' => [
                'required',
                'integer',
                'exists:roles,role_id',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'matriculation_no.required' => 'Matriculation number is required.',
            'matriculation_no.unique' => 'Matriculation number is already taken.',
            'matriculation_no.regex' => 'Matriculation number must be alphanumeric.',
            'full_name.required' => 'Full name is required.',
            'email.required' => 'Email is required.',
            'email.unique' => 'Email is already taken.',
            'password.min' => 'Password must be at least 8 characters.',
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
