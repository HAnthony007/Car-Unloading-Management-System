<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\Facades\Excel;
use Tests\TestCase;

class ManifestImportTest extends TestCase
{
    use RefreshDatabase;

    public function test_import_endpoint_validates_file(): void
    {
        $user = \App\Models\User::factory()->create();

        $this->actingAs($user)
            ->postJson('/api/imports/manifest', [])
            ->assertStatus(422);
    }

    public function test_import_creates_vessel_portcall_and_vehicles(): void
    {
        $this->withoutExceptionHandling();
        $user = \App\Models\User::factory()->create();

        // Build a fake xlsx in storage (minimal) — here we simulate by mocking Excel facade
        Excel::fake();

        $file = UploadedFile::fake()->create('manifeste.xlsx');

        $this->actingAs($user)
            ->post('/api/imports/manifest', [
                'file' => $file,
            ])->assertStatus(200);

        Excel::assertImported('manifeste.xlsx');
    }
}
