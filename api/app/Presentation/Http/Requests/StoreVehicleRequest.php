<?php

namespace App\Presentation\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

final class StoreVehicleRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'vin' => ['required', 'string', 'max:255', 'unique:vehicles,vin'],
            'make' => ['required', 'string', 'max:255'],
            'model' => ['required', 'string', 'max:255'],
            'color' => ['nullable', 'string', 'max:255'],
            'type' => ['required', 'string', 'max:255'],
            'weight' => ['required', 'string', 'max:255'],
            'vehicle_condition' => ['required', 'string', 'max:255'],
            'vehicle_observation' => ['nullable', 'string', 'max:1000'],
            'origin_country' => ['required', 'string', 'max:255'],
            'ship_location' => ['nullable', 'string', 'max:255'],
            'is_primed' => ['boolean'],
            'discharge_id' => ['required', 'integer'],
        ];
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('vin')) {
            $this->merge([
                'vin' => strtoupper(trim((string) $this->input('vin'))),
            ]);
        }
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
