<?php

namespace App\Presentation\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

final class CreateSurveyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'date' => ['required', 'date'],
            'result' => ['required', 'string', 'in:PASSED,FAILED,PENDING'],
            'user_id' => ['required', 'integer', 'exists:users,user_id'],
            'follow_up_file_id' => ['required', 'integer', 'exists:follow_up_files,follow_up_file_id'],
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
