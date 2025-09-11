<?php

namespace App\Presentation\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class StoreDischargeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'discharge_date' => ['required', 'date'],
            'port_call_id' => ['required', 'integer', 'exists:port_calls,port_call_id'],
            'vehicle_id' => ['required', 'integer', 'exists:vehicles,vehicle_id'],
            'agent_id' => ['required', 'integer', 'exists:users,user_id'],
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
