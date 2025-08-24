<?php

use App\Models\Role;
use App\Models\User as EloquentUser;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

uses(RefreshDatabase::class);

beforeEach(function () {
    // Créer un rôle de test
            $this->role = Role::factory()->create([
            'role_id' => 1,
            'role_name' => 'User',
            'role_description' => 'Regular user'
        ]);

    // Créer un utilisateur de test pour l'authentification
    $this->user = EloquentUser::factory()->create([
        'role_id' => $this->role->role_id,
        'email_verified_at' => now()
    ]);

    // Authentifier l'utilisateur
    Sanctum::actingAs($this->user);
});

describe('User API Endpoints', function () {
    
    describe('GET /api/users - List Users', function () {
        it('returns paginated users list', function () {
            // Créer quelques utilisateurs de test
            EloquentUser::factory()->count(5)->create([
                'role_id' => $this->role->role_id
            ]);

            $response = $this->getJson('/api/users');



            $response->assertStatus(200)
                ->assertJsonStructure([
                    'data' => [
                        '*' => [
                            'user_id',
                            'matriculation_number',
                            'full_name',
                            'email',
                            'role_id'
                        ]
                    ],
                    'meta' => [
                        'current_page',
                        'from',
                        'last_page',
                        'path',
                        'per_page',
                        'to',
                        'total'
                    ]
                ]);
        });

        it('filters users by search term', function () {
            EloquentUser::factory()->create([
                'full_name' => 'John Doe',
                'role_id' => $this->role->role_id
            ]);

            EloquentUser::factory()->create([
                'full_name' => 'Jane Smith',
                'role_id' => $this->role->role_id
            ]);

            $response = $this->getJson('/api/users?search_term=john');



            $response->assertStatus(200)
                ->assertJsonCount(1, 'data')
                ->assertJsonPath('data.0.full_name', 'John Doe');
        });

        it('filters users by role', function () {
            $adminRole = Role::factory()->create(['role_name' => 'Admin']);
            
            // Créer un utilisateur avec le rôle admin
            EloquentUser::factory()->create([
                'role_id' => $adminRole->role_id
            ]);

            // Filtrer par le rôle admin (qui devrait avoir 1 utilisateur)
            $response = $this->getJson('/api/users?role_id=' . $adminRole->role_id);

            $response->assertStatus(200)
                ->assertJsonCount(1, 'data');
        });

        it('filters users by matriculation prefix', function () {
            EloquentUser::factory()->create([
                'matriculation_no' => 'TEST001',
                'role_id' => $this->role->role_id
            ]);

            EloquentUser::factory()->create([
                'matriculation_no' => 'ADMIN001',
                'role_id' => $this->role->role_id
            ]);

            $response = $this->getJson('/api/users?matriculation_prefix=TEST');

            $response->assertStatus(200)
                ->assertJsonCount(1, 'data')
                ->assertJsonPath('data.0.matriculation_number', 'TEST001');
        });

        it('handles pagination correctly', function () {
            EloquentUser::factory()->count(25)->create([
                'role_id' => $this->role->role_id
            ]);

            $response = $this->getJson('/api/users?page=2&per_page=10');

            $response->assertStatus(200)
                ->assertJsonPath('meta.current_page', 2)
                ->assertJsonPath('meta.per_page', 10)
                ->assertJsonPath('meta.total', 26); // 25 créés + 1 dans beforeEach
        });
    });

    describe('POST /api/users - Create User', function () {
        it('creates a new user successfully', function () {
            $userData = [
                'matriculation_no' => 'NEW001',
                'full_name' => 'New User',
                'email' => 'newuser@example.com',
                'password' => 'password123',
                'password_confirmation' => 'password123',
                'role_id' => $this->role->role_id
            ];

            $response = $this->postJson('/api/users', $userData);



            $response->assertStatus(201)
                ->assertJson([
                    'message' => 'User created successfully.'
                ])
                ->assertJsonStructure([
                    'data' => [
                        'user_id',
                        'matriculation_number',
                        'full_name',
                        'email',
                        'role_id'
                    ]
                ]);

            $this->assertDatabaseHas('users', [
                'matriculation_no' => 'NEW001',
                'email' => 'newuser@example.com'
            ]);
        });

        it('validates required fields', function () {
            $response = $this->postJson('/api/users', []);

            $response->assertStatus(422)
                ->assertJsonValidationErrors([
                    'matriculation_no',
                    'full_name',
                    'email',
                    'password',
                    'role_id'
                ]);
        });

        it('validates unique matriculation number', function () {
            EloquentUser::factory()->create([
                'matriculation_no' => 'EXIST001',
                'role_id' => $this->role->role_id
            ]);

            $userData = [
                'matriculation_no' => 'EXIST001',
                'full_name' => 'Another User',
                'email' => 'another@example.com',
                'password' => 'password123',
                'password_confirmation' => 'password123',
                'role_id' => $this->role->role_id
            ];

            $response = $this->postJson('/api/users', $userData);

            $response->assertStatus(422)
                ->assertJsonValidationErrors(['matriculation_no']);
        });

        it('validates unique email', function () {
            EloquentUser::factory()->create([
                'email' => 'existing@example.com',
                'role_id' => $this->role->role_id
            ]);

            $userData = [
                'matriculation_no' => 'NEW002',
                'full_name' => 'Another User',
                'email' => 'existing@example.com',
                'password' => 'password123',
                'password_confirmation' => 'password123',
                'role_id' => $this->role->role_id
            ];

            $response = $this->postJson('/api/users', $userData);

            $response->assertStatus(422)
                ->assertJsonValidationErrors(['email']);
        });

        it('validates password confirmation', function () {
            $userData = [
                'matriculation_no' => 'NEW003',
                'full_name' => 'New User',
                'email' => 'newuser3@example.com',
                'password' => 'password123',
                'password_confirmation' => 'different',
                'role_id' => $this->role->role_id
            ];

            $response = $this->postJson('/api/users', $userData);

            $response->assertStatus(422)
                ->assertJsonValidationErrors(['password']);
        });

        it('validates role exists', function () {
            $userData = [
                'matriculation_no' => 'NEW004',
                'full_name' => 'New User',
                'email' => 'newuser4@example.com',
                'password' => 'password123',
                'password_confirmation' => 'password123',
                'role_id' => 999 // Role inexistant
            ];

            $response = $this->postJson('/api/users', $userData);

            $response->assertStatus(422)
                ->assertJsonValidationErrors(['role_id']);
        });
    });

    describe('GET /api/users/{userId} - Show User', function () {
        it('returns user details by ID', function () {
            $testUser = EloquentUser::factory()->create([
                'role_id' => $this->role->role_id
            ]);

            $response = $this->getJson("/api/users/{$testUser->user_id}");

            $response->assertStatus(200)
                ->assertJsonStructure([
                    'data' => [
                        'user_id',
                        'matriculation_number',
                        'full_name',
                        'email',
                        'role_id',
                        'avatar',
                        'phone',
                        'email_verified_at',
                        'created_at'
                    ]
                ])
                ->assertJsonPath('data.user_id', (string)$testUser->user_id);
        });

        it('returns 404 for non-existent user', function () {
            $response = $this->getJson('/api/users/999');

            $response->assertStatus(404)
                ->assertJson([
                    'error' => 'User not found.'
                ]);
        });
    });

    describe('GET /api/users/matriculation/{matriculationNumber} - Show User by Matriculation', function () {
        it('returns user details by matriculation number', function () {
            $testUser = EloquentUser::factory()->create([
                'matriculation_no' => 'MAT001',
                'role_id' => $this->role->role_id
            ]);



            $response = $this->getJson('/api/users/matriculation/MAT001');

            $response->assertStatus(200)
                ->assertJsonPath('data.matriculation_number', 'MAT001');
        });

        it('returns 404 for non-existent matriculation', function () {
            $response = $this->getJson('/api/users/matriculation/NONEXISTENT');

            $response->assertStatus(404)
                ->assertJson([
                    'error' => 'User not found.'
                ]);
        });
    });

    describe('PUT /api/users/{userId} - Update User', function () {
        it('updates user profile successfully', function () {
            $testUser = EloquentUser::factory()->create([
                'role_id' => $this->role->role_id
            ]);

            $updateData = [
                'full_name' => 'Updated Name',
                'phone' => '+1234567890',
                'avatar' => '/avatars/updated.jpg'
            ];

            $response = $this->putJson("/api/users/{$testUser->user_id}", $updateData);

            $response->assertStatus(200)
                ->assertJson([
                    'message' => 'User updated successfully.'
                ])
                ->assertJsonPath('data.full_name', 'Updated Name')
                ->assertJsonPath('data.phone', '+1234567890')
                ->assertJsonPath('data.avatar', 'http://localhost/storage/avatars//avatars/updated.jpg');

            $this->assertDatabaseHas('users', [
                'user_id' => $testUser->user_id,
                'full_name' => 'Updated Name',
                'phone' => '+1234567890'
            ]);
        });

        it('updates only provided fields', function () {
            $testUser = EloquentUser::factory()->create([
                'full_name' => 'Original Name',
                'phone' => '+0987654321',
                'role_id' => $this->role->role_id
            ]);

            $updateData = [
                'full_name' => 'New Name Only'
            ];

            $response = $this->putJson("/api/users/{$testUser->user_id}", $updateData);

            $response->assertStatus(200)
                ->assertJsonPath('data.full_name', 'New Name Only')
                ->assertJsonPath('data.phone', '+0987654321'); // Phone unchanged

            $this->assertDatabaseHas('users', [
                'user_id' => $testUser->user_id,
                'full_name' => 'New Name Only',
                'phone' => '+0987654321'
            ]);
        });

        it('validates phone number format', function () {
            $testUser = EloquentUser::factory()->create([
                'role_id' => $this->role->role_id
            ]);

            $updateData = [
                'phone' => 'invalid-phone-format'
            ];

            $response = $this->putJson("/api/users/{testUser->user_id}", $updateData);

            $response->assertStatus(422)
                ->assertJsonValidationErrors(['phone']);
        });

        it('returns 404 for non-existent user', function () {
            $updateData = [
                'full_name' => 'Updated Name'
            ];

            $response = $this->putJson('/api/users/999', $updateData);



            $response->assertStatus(404)
                ->assertJson([
                    'error' => 'User not found.'
                ]);
        });
    });

    describe('DELETE /api/users/{userId} - Delete User', function () {
        it('deletes user successfully', function () {
            $testUser = EloquentUser::factory()->create([
                'role_id' => $this->role->role_id
            ]);

            $response = $this->deleteJson("/api/users/{$testUser->user_id}");

            $response->assertStatus(200)
                ->assertJson([
                    'message' => 'User deleted successfully.'
                ]);

            $this->assertDatabaseMissing('users', [
                'user_id' => $testUser->user_id
            ]);
        });

        it('returns 404 for non-existent user', function () {
            $response = $this->deleteJson('/api/users/999');

            $response->assertStatus(404)
                ->assertJson([
                    'error' => 'User not found.'
                ]);
        });
    });

    describe('Authentication & Authorization', function () {
        it('requires authentication for all endpoints', function () {
            // Créer une nouvelle instance sans authentification
            $this->app->make('auth')->forgetGuards();
            
            $response = $this->getJson('/api/users');
            $response->assertStatus(401);

            $response = $this->postJson('/api/users', []);
            $response->assertStatus(401);

            $response = $this->getJson('/api/users/1');
            $response->assertStatus(401);

            $response = $this->putJson('/api/users/1', []);
            $response->assertStatus(401);

            $response = $this->deleteJson('/api/users/1');
            $response->assertStatus(401);
        });
    });
});
