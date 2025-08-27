<?php

namespace Tests\Feature;

use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class UsersImportTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Créer des rôles de test
        Role::factory()->create([
            'role_id' => 1,
            'role_name' => 'admin',
            'role_description' => 'Administrator',
        ]);

        Role::factory()->create([
            'role_id' => 2,
            'role_name' => 'agent',
            'role_description' => 'Agent',
        ]);

        // Créer un utilisateur pour l'authentification
        $user = User::factory()->create([
            'role_id' => 1,
            'email' => 'test@example.com',
        ]);

        $this->actingAs($user);
    }

    /** @test */
    public function it_can_import_users_from_csv_file()
    {
        Storage::fake('local');

        // Créer un fichier CSV de test
        $csvContent = "matriculation_no,full_name,email,password,phone,role_name,avatar,email_verified\n";
        $csvContent .= "IMP001,John Import,john.import@example.com,password123,+33123456789,admin,,true\n";
        $csvContent .= "IMP002,Jane Import,jane.import@example.com,password456,+33987654321,agent,,false\n";

        $file = UploadedFile::fake()->createWithContent('test_import.csv', $csvContent);

        $response = $this->postJson('/api/users/import', [
            'file' => $file,
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Importation terminée avec succès.',
                'data' => [
                    'imported_users' => 2,
                    'skipped_users' => 0,
                    'total_processed' => 2,
                ],
            ]);

        // Vérifier que les utilisateurs ont été créés
        $this->assertDatabaseHas('users', [
            'matriculation_no' => 'IMP001',
            'full_name' => 'John Import',
            'email' => 'john.import@example.com',
        ]);

        $this->assertDatabaseHas('users', [
            'matriculation_no' => 'IMP002',
            'full_name' => 'Jane Import',
            'email' => 'jane.import@example.com',
        ]);
    }

    /** @test */
    public function it_skips_existing_users_during_import()
    {
        // Créer un utilisateur existant
        User::factory()->create([
            'matriculation_no' => 'EXIST001',
            'email' => 'existing@example.com',
            'role_id' => 1,
        ]);

        Storage::fake('local');

        $csvContent = "matriculation_no,full_name,email,password,phone,role_name,avatar,email_verified\n";
        $csvContent .= "EXIST001,Existing User,existing@example.com,password123,+33123456789,admin,,true\n";
        $csvContent .= "NEW001,New User,new@example.com,password456,+33987654321,agent,,false\n";

        $file = UploadedFile::fake()->createWithContent('test_import.csv', $csvContent);

        $response = $this->postJson('/api/users/import', [
            'file' => $file,
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Importation terminée avec succès.',
                'data' => [
                    'imported_users' => 1,
                    'skipped_users' => 1,
                    'total_processed' => 2,
                ],
            ]);

        // Vérifier qu'il n'y a qu'un seul utilisateur avec cette matriculation
        $this->assertEquals(1, User::where('matriculation_no', 'EXIST001')->count());

        // Vérifier que le nouvel utilisateur a été créé
        $this->assertDatabaseHas('users', [
            'matriculation_no' => 'NEW001',
            'email' => 'new@example.com',
        ]);
    }

    /** @test */
    public function it_validates_file_type()
    {
        Storage::fake('local');

        $file = UploadedFile::fake()->create('test.txt', 100);

        $response = $this->postJson('/api/users/import', [
            'file' => $file,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['file']);
    }

    /** @test */
    public function it_requires_authentication()
    {
        // Déconnecter l'utilisateur
        auth()->logout();

        Storage::fake('local');
        $file = UploadedFile::fake()->create('test.csv', 100);

        $response = $this->postJson('/api/users/import', [
            'file' => $file,
        ]);

        $response->assertStatus(401);
    }

    /** @test */
    public function it_handles_invalid_role_names()
    {
        Storage::fake('local');

        $csvContent = "matriculation_no,full_name,email,password,phone,role_name,avatar,email_verified\n";
        $csvContent .= "INV001,Invalid Role User,invalid@example.com,password123,+33123456789,invalid_role,,true\n";

        $file = UploadedFile::fake()->createWithContent('test_import.csv', $csvContent);

        $response = $this->postJson('/api/users/import', [
            'file' => $file,
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Importation terminée avec succès.',
                'data' => [
                    'imported_users' => 0,
                    'skipped_users' => 1,
                    'total_processed' => 1,
                ],
            ]);

        // Vérifier que l'utilisateur n'a pas été créé
        $this->assertDatabaseMissing('users', [
            'matriculation_no' => 'INV001',
        ]);
    }
}
