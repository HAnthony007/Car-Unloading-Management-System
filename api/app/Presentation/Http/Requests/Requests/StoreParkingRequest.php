<?php

namespace App\Presentation\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreParkingRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
    return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'parking_name' => ['required', 'string', 'max:255'],
            'location' => ['required', 'string', 'max:255'],
            'capacity' => ['required', 'integer', 'min:0'],
        ];
    }
}
