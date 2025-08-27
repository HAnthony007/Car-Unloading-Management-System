<?php

namespace App\Presentation\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreFollowUpFileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'bill_of_lading' => ['required', 'string', 'max:255'],
            'status' => ['required', 'in:OPEN,IN_PROGRESS,CLOSED'],
            'vehicle_id' => ['required', 'integer', 'exists:vehicles,vehicle_id'],
            'port_call_id' => ['required', 'integer', 'exists:port_calls,port_call_id'],
        ];
    }
}
