<?php

namespace App\Presentation\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

final class UpdateSurveyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'survey_date' => ['sometimes', 'date'],
            'survey_name' => ['sometimes', 'string', 'max:255'],
            'survey_description' => ['sometimes', 'nullable', 'string'],
            'overall_status' => ['sometimes', 'string', 'in:PENDING,IN_PROGRESS,COMPLETED'],
            'agent_id' => ['sometimes', 'integer', 'exists:users,user_id'],
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
