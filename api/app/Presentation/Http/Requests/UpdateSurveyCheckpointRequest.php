<?php

namespace App\Presentation\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

final class UpdateSurveyCheckpointRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title_checkpoint' => ['sometimes', 'string', 'max:255'],
            'comment_checkpoint' => ['sometimes', 'nullable', 'string', 'max:1000'],
            'description_checkpoint' => ['sometimes', 'nullable', 'string'],
            'result_checkpoint' => ['sometimes', 'nullable', 'string', 'max:255'],
            'order_checkpoint' => ['sometimes', 'nullable', 'integer', 'min:0'],
            // Backward compat input names
            'title' => ['sometimes', 'string', 'max:255'],
            'comment' => ['sometimes', 'nullable', 'string', 'max:1000'],
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
