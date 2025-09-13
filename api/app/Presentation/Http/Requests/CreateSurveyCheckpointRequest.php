<?php

namespace App\Presentation\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

final class CreateSurveyCheckpointRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title_checkpoint' => ['required_without:title', 'string', 'max:255'],
            'comment_checkpoint' => ['nullable', 'string', 'max:1000'],
            'description_checkpoint' => ['nullable', 'string'],
            'result_checkpoint' => ['nullable', 'string', 'max:255'],
            'order_checkpoint' => ['nullable', 'integer', 'min:0'],
            // Backward compat input names
            'title' => ['sometimes', 'string', 'max:255'],
            'comment' => ['sometimes', 'nullable', 'string', 'max:1000'],
            'survey_id' => ['required', 'integer', 'exists:surveys,survey_id'],
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
