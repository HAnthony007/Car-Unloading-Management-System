<?php

namespace App\Presentation\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateFollowUpFileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'bill_of_lading' => ['sometimes', 'string', 'max:255'],
            'status' => ['sometimes', 'in:OPEN,IN_PROGRESS,CLOSED'],
            'vehicle_id' => ['sometimes', 'integer', 'exists:vehicles,vehicle_id'],
            'port_call_id' => ['sometimes', 'integer', 'exists:port_calls,port_call_id'],
        ];
    }
}
