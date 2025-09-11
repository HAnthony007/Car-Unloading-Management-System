<?php

namespace App\Presentation\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CheckPortCallVehicleVinRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // middleware already secures route
    }

    protected function prepareForValidation(): void
    {
        $vin = (string)$this->query('vin', '');
        // Normalize: remove spaces, uppercase
        $vin = strtoupper(str_replace([' ', '-'], '', trim($vin)));
        $this->merge(['vin' => $vin]);
    }

    public function rules(): array
    {
        return [
            // 17 chars, alphanumeric, excluding I O Q per VIN standard
            'vin' => ['required','string','size:17','regex:/^[A-HJ-NPR-Z0-9]{17}$/'],
        ];
    }

    public function messages(): array
    {
        return [
            'vin.required' => 'Le VIN est requis.',
            'vin.size' => 'Le VIN doit contenir exactement 17 caractères.',
            'vin.regex' => 'Le VIN contient des caractères invalides (I, O, Q interdits).',
        ];
    }
}
