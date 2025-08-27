<?php

namespace App\Presentation\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class StoreVesselRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'imo_no' => ['required', 'string', 'regex:/^([Ii][Mm][Oo])?\s?\d{7}$/', 'max:20', 'unique:vessels,imo_no'],
            'vessel_name' => ['required', 'string', 'max:150'],
            'flag' => ['required', 'string', 'max:100'],
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
