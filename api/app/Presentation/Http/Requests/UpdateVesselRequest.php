<?php

namespace App\Presentation\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Validation\Rule;

class UpdateVesselRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $vesselId = (int) $this->route('id');
        return [
            'imo_no' => [
                'sometimes', 'string', 'regex:/^([Ii][Mm][Oo])?\s?\d{7}$/', 'max:20',
                Rule::unique('vessels', 'imo_no')->ignore($vesselId, 'vessel_id')
            ],
            'vessel_name' => ['sometimes', 'string', 'max:150'],
            'flag' => ['sometimes', 'string', 'max:100'],
        ];
    }

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
