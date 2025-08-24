<?php

namespace App\Presentation\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

final class ImportUsersRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'file' => [
                'required',
                'file',
                'mimes:xlsx,xls,csv',
                'max:2048', // 2MB max
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'file.required' => 'Un fichier est requis pour l\'importation.',
            'file.file' => 'Le fichier téléchargé n\'est pas valide.',
            'file.mimes' => 'Le fichier doit être de type Excel (.xlsx, .xls) ou CSV (.csv).',
            'file.max' => 'Le fichier ne doit pas dépasser 2MB.',
        ];
    }

    protected function failedValidation(Validator $validator): void
    {
        throw new HttpResponseException(
            response()->json([
                'message' => 'Les données fournies ne sont pas valides.',
                'errors' => $validator->errors(),
            ], 422)
        );
    }
}
