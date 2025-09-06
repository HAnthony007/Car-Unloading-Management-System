<?php

namespace Tests\Feature;

use App\Models\Discharge;
use App\Models\Dock;
use App\Models\Document as EloquentDocument;
use App\Models\FollowUpFile;
use App\Models\PortCall;
use App\Models\Role;
use App\Models\User as EloquentUser;
use App\Models\Vessel;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class DocumentControllerTest extends TestCase
{
    use RefreshDatabase;

    protected EloquentUser $user;

    private function seedGraphForDocument(): array
    {
        $vessel = Vessel::query()->create([
            'imo_no' => 'IMO'.random_int(10000, 99999),
            'vessel_name' => 'Test Vessel',
            'flag' => 'FR',
        ]);

        $dock = Dock::query()->create([
            'dock_name' => 'Dock A',
            'location' => 'Zone 1',
        ]);

        $pc = PortCall::query()->create([
            'vessel_agent' => 'Agent X',
            'origin_port' => 'Origin',
            'estimated_arrival' => now(),
            'arrival_date' => now(),
            'vessel_id' => $vessel->vessel_id,
            'dock_id' => $dock->dock_id,
        ]);

        $vehicleIdForDischarge = DB::table('vehicles')->insertGetId([
            'vin' => 'VIN'.random_int(10000, 99999),
            'make' => 'MakeX',
            'model' => 'ModelX',
            'type' => 'TypeX',
            'weight' => '1000',
            'vehicle_condition' => 'NEW',
            'origin_country' => 'FR',
            'is_primed' => 0,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        $discharge = Discharge::query()->create([
            'discharge_timestamp' => now(),
            'status' => 'pending',
            'port_call_id' => $pc->port_call_id,
            'vehicle_id' => $vehicleIdForDischarge,
            'agent_id' => $this->user->user_id,
        ]);

        $vehicleId = DB::table('vehicles')->insertGetId([
            'vin' => 'VIN'.random_int(10000, 99999),
            'make' => 'Make',
            'model' => 'Model',
            'type' => 'Type',
            'weight' => '1000',
            'vehicle_condition' => 'NEW',
            'origin_country' => 'FR',
            'is_primed' => 0,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $fuf = FollowUpFile::query()->create([
            'bill_of_lading' => 'BOL'.random_int(1000, 9999),
            'status' => 'OPEN',
            'vehicle_id' => $vehicleId,
            'port_call_id' => $pc->port_call_id,
        ]);

        return [$fuf->follow_up_file_id, $pc->port_call_id];
    }

    protected function setUp(): void
    {
        parent::setUp();
        $role = Role::factory()->create([
            'role_name' => 'User',
            'role_description' => 'Regular user',
        ]);
        $this->user = EloquentUser::factory()->create([
            'role_id' => $role->role_id,
            'email_verified_at' => now(),
        ]);
        Sanctum::actingAs($this->user);
    }

    public function test_lists_documents_with_filters(): void
    {
        [$fufId, $portCallId] = $this->seedGraphForDocument();

        EloquentDocument::query()->create([
            'document_path' => 'docs/a.pdf',
            'document_description' => 'Invoice',
            'type' => 'invoice',
            'uploaded_at' => now()->subDay(),
            'follow_up_file_id' => $fufId,
            'port_call_id' => $portCallId,
        ]);

        $response = $this->getJson('/api/documents?follow_up_file_id='.$fufId.'&per_page=1&page=1');
        $response->assertOk()
            ->assertJsonStructure([
                'data' => [[
                    'document_id', 'document_path', 'document_description', 'type', 'uploaded_at', 'follow_up_file_id', 'port_call_id',
                ]],
                'meta' => ['current_page', 'from', 'last_page', 'path', 'per_page', 'to', 'total'],
            ]);
    }

    public function test_creates_a_document(): void
    {
        [$fufId, $portCallId] = $this->seedGraphForDocument();
        $payload = [
            'document_path' => 'docs/b.pdf',
            'document_description' => 'Packing List',
            'type' => 'packing_list',
            'uploaded_at' => now()->toDateTimeString(),
            'follow_up_file_id' => $fufId,
            'port_call_id' => $portCallId,
        ];

        $res = $this->postJson('/api/documents', $payload);
        $res->assertCreated()->assertJsonPath('data.document_path', 'docs/b.pdf');

        $this->assertDatabaseHas('documents', [
            'document_path' => 'docs/b.pdf',
            'type' => 'packing_list',
            'follow_up_file_id' => $fufId,
        ]);
    }

    public function test_validates_when_creating(): void
    {
        $res = $this->postJson('/api/documents', []);
        $res->assertStatus(422)
            ->assertJsonValidationErrors(['document_path', 'type', 'uploaded_at', 'follow_up_file_id']);
    }

    public function test_shows_a_document(): void
    {
        [$fufId, $portCallId] = $this->seedGraphForDocument();
        $id = EloquentDocument::query()->insertGetId([
            'document_path' => 'docs/c.pdf',
            'document_description' => 'BL',
            'type' => 'bl',
            'uploaded_at' => now(),
            'follow_up_file_id' => $fufId,
            'port_call_id' => $portCallId,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $res = $this->getJson('/api/documents/'.$id);
        $res->assertOk()->assertJsonPath('data.document_id', $id);
    }

    public function test_updates_a_document(): void
    {
        [$fufId, $portCallId] = $this->seedGraphForDocument();
        $id = EloquentDocument::query()->insertGetId([
            'document_path' => 'docs/d.pdf',
            'document_description' => 'Old',
            'type' => 'other',
            'uploaded_at' => now(),
            'follow_up_file_id' => $fufId,
            'port_call_id' => $portCallId,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $res = $this->putJson('/api/documents/'.$id, ['document_description' => 'New']);
        $res->assertOk()->assertJsonPath('data.document_description', 'New');

        $this->assertDatabaseHas('documents', [
            'document_id' => $id,
            'document_description' => 'New',
        ]);
    }

    public function test_deletes_a_document(): void
    {
        [$fufId, $portCallId] = $this->seedGraphForDocument();
        $id = EloquentDocument::query()->insertGetId([
            'document_path' => 'docs/e.pdf',
            'document_description' => 'Tmp',
            'type' => 'tmp',
            'uploaded_at' => now(),
            'follow_up_file_id' => $fufId,
            'port_call_id' => $portCallId,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $res = $this->deleteJson('/api/documents/'.$id);
        $res->assertOk()->assertJson(['message' => 'Document deleted successfully.']);

        $this->assertDatabaseMissing('documents', ['document_id' => $id]);
    }

    public function test_requires_authentication(): void
    {
        app('auth')->forgetGuards();
        $this->getJson('/api/documents')->assertStatus(401);
        $this->postJson('/api/documents', [])->assertStatus(401);
        $this->getJson('/api/documents/1')->assertStatus(401);
        $this->putJson('/api/documents/1', [])->assertStatus(401);
        $this->deleteJson('/api/documents/1')->assertStatus(401);
    }
}
