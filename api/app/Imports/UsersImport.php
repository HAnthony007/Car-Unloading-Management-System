<?php

namespace App\Imports;

use App\Models\Role;
use App\Models\User;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Concerns\Importable;
use Maatwebsite\Excel\Concerns\SkipsErrors;
use Maatwebsite\Excel\Concerns\SkipsFailures;
use Maatwebsite\Excel\Concerns\SkipsOnError;
use Maatwebsite\Excel\Concerns\SkipsOnFailure;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class UsersImport implements SkipsOnError, SkipsOnFailure, ToCollection, WithHeadingRow
{
    use Importable, SkipsErrors, SkipsFailures;

    protected $importedCount = 0;

    protected $skippedCount = 0;

    protected $errors = [];

    public function collection(Collection $rows)
    {
        foreach ($rows as $rowIndex => $row) {
            try {
                // Validation manuelle des données requises
                if (empty($row['matriculation_no']) || empty($row['full_name']) || empty($row['email'])) {
                    $this->skippedCount++;
                    $this->errors[] = 'Ligne '.($rowIndex + 2).': Données manquantes (matriculation_no, full_name ou email requis)';

                    continue;
                }

                // Vérifier si l'utilisateur existe déjà par email ou matriculation
                $existingUser = User::where('email', $row['email'])
                    ->orWhere('matriculation_no', $row['matriculation_no'])
                    ->first();

                if ($existingUser) {
                    $this->skippedCount++;
                    $this->errors[] = 'Ligne '.($rowIndex + 2).": Utilisateur déjà existant (email: {$row['email']} ou matriculation: {$row['matriculation_no']})";

                    continue;
                }

                // Rechercher le rôle par nom ou ID
                $role = null;
                if (isset($row['role_name']) && ! empty($row['role_name'])) {
                    $role = Role::where('role_name', $row['role_name'])->first();
                } elseif (isset($row['role_id']) && ! empty($row['role_id'])) {
                    $role = Role::find($row['role_id']);
                }

                if (! $role) {
                    $this->skippedCount++;
                    $this->errors[] = 'Ligne '.($rowIndex + 2).': Rôle non trouvé (role_name: '.($row['role_name'] ?? 'N/A').')';

                    continue;
                }

                // Créer l'utilisateur
                User::create([
                    'matriculation_no' => $row['matriculation_no'],
                    'full_name' => $row['full_name'],
                    'email' => $row['email'],
                    'password' => Hash::make($row['password'] ?? 'password123'), // mot de passe par défaut si non fourni
                    'phone' => $row['phone'] ?? null,
                    'role_id' => $role->role_id,
                    'avatar' => $row['avatar'] ?? null,
                    'email_verified_at' => isset($row['email_verified']) && $row['email_verified'] ? now() : null,
                ]);

                $this->importedCount++;

                Log::info("Utilisateur importé: {$row['email']}");

            } catch (\Exception $e) {
                $this->skippedCount++;
                $this->errors[] = 'Ligne '.($rowIndex + 2).': '.$e->getMessage();
                Log::error("Erreur lors de l'import de l'utilisateur ligne ".($rowIndex + 2).': '.$e->getMessage());
            }
        }
    }

    public function getImportedCount(): int
    {
        return $this->importedCount;
    }

    public function getSkippedCount(): int
    {
        return $this->skippedCount;
    }

    public function getErrors(): array
    {
        return $this->errors;
    }

    public function headingRow(): int
    {
        return 1;
    }
}
