<?php

namespace Tests\Feature;

use App\Models\Role;
use App\Models\User as EloquentUser;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class SurveyTemplateControllerTest extends TestCase
{
    use RefreshDatabase;

    private EloquentUser $user;

    protected function setUp(): void
    {
        parent::setUp();
        $role = Role::factory()->create();
        $this->user = EloquentUser::factory()->create(['role_id' => $role->role_id, 'email_verified_at' => now()]);
        Sanctum::actingAs($this->user);
    }

    public function test_creates_template_with_checkpoints(): void
    {
        $payload = [
            'template_key' => 'externe_new',
            'name' => 'Inspection Externe NEW',
            'description' => 'Desc',
            'default_overall_status' => 'PENDING',
            'checkpoints' => [
                ['title_checkpoint' => 'A', 'order_checkpoint' => 1],
                ['title_checkpoint' => 'B', 'order_checkpoint' => 2],
            ],
        ];
        $this->postJson('/api/inspection/templates', $payload)
            ->assertCreated()
            ->assertJsonPath('data.template_key', 'externe_new')
            ->assertJsonCount(2, 'data.checkpoints');
        $this->assertDatabaseHas('survey_templates', ['template_key' => 'externe_new']);
    }

    public function test_updates_template(): void
    {
        $this->test_creates_template_with_checkpoints();
        $t = \App\Models\SurveyTemplate::where('template_key', 'externe_new')->first();
        $this->putJson('/api/inspection/templates/'.$t->survey_template_id, ['name' => 'Renamed'])
            ->assertOk()
            ->assertJsonPath('data.name', 'Renamed');
    }

    public function test_adds_checkpoint(): void
    {
        $this->test_creates_template_with_checkpoints();
        $t = \App\Models\SurveyTemplate::where('template_key', 'externe_new')->first();
        $this->postJson('/api/inspection/templates/'.$t->survey_template_id.'/checkpoints', [
            'title_checkpoint' => 'C', 'order_checkpoint' => 3,
        ])->assertCreated();
        $this->assertDatabaseHas('survey_template_checkpoints', ['title_checkpoint' => 'C']);
    }

    public function test_deactivates_template(): void
    {
        $this->test_creates_template_with_checkpoints();
        $t = \App\Models\SurveyTemplate::where('template_key', 'externe_new')->first();
        $this->deleteJson('/api/inspection/templates/'.$t->survey_template_id)
            ->assertOk()
            ->assertJsonPath('message', 'Template deactivated');
        $this->assertDatabaseHas('survey_templates', ['survey_template_id' => $t->survey_template_id, 'active' => false]);
    }

    public function test_requires_auth(): void
    {
        app('auth')->forgetGuards();
        $this->getJson('/api/inspection/templates')->assertStatus(401);
    }
}
