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
            'survey_date' => ['required', 'date'],
            'survey_name' => ['sometimes', 'string', 'max:255'],
            'survey_description' => ['nullable', 'string'],
            'overall_status' => ['required', 'string', 'in:PASSED,FAILED,PENDING'],
            'agent_id' => ['required', 'integer', 'exists:users,user_id'],
            'discharge_id' => ['required', 'integer', 'exists:discharges,discharge_id'],
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
