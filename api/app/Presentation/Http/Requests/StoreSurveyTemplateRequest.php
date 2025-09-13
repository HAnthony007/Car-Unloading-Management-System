<?php

namespace App\Presentation\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class StoreSurveyTemplateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'template_key' => ['required', 'string', 'max:100', 'alpha_dash', 'unique:survey_templates,template_key'],
            'name' => ['required', 'string', 'max:150'],
            'description' => ['nullable', 'string', 'max:255'],
            'default_overall_status' => ['sometimes', 'in:PENDING,PASSED,FAILED'],
            'checkpoints' => ['required', 'array', 'min:1'],
            'checkpoints.*.title_checkpoint' => ['required', 'string', 'max:150'],
            'checkpoints.*.description_checkpoint' => ['nullable', 'string', 'max:255'],
            'checkpoints.*.default_result_checkpoint' => ['nullable', 'string', 'max:100'],
            'checkpoints.*.order_checkpoint' => ['nullable', 'integer', 'min:0'],
        ];
    }

    protected function failedValidation(Validator $validator): void
    {
        throw new HttpResponseException(response()->json([
            'message' => 'Validation failed.',
            'errors' => $validator->errors()->messages(),
        ], 422));
    }
}
