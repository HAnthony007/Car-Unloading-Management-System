<?php

use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\Discharge;
use App\Models\Dock;
use App\Models\Document;
use App\Models\FollowUpFile;
use App\Models\Movement;
use App\Models\Parking;
use App\Models\Photo;
use App\Models\PortCall;
use App\Models\Role;
use App\Models\Survey;
use App\Models\SurveyCheckpoint;
use App\Models\SurveyCheckpointStep;
use App\Models\User;
use App\Models\Vehicle;
use App\Models\Vessel;

uses(RefreshDatabase::class);

it('can create models using factories', function () {
    expect(Role::factory()->create())->toBeInstanceOf(Role::class);
    expect(User::factory()->create())->toBeInstanceOf(User::class);
    expect(Vessel::factory()->create())->toBeInstanceOf(Vessel::class);
    expect(Dock::factory()->create())->toBeInstanceOf(Dock::class);
    expect(PortCall::factory()->create())->toBeInstanceOf(PortCall::class);
    expect(Discharge::factory()->create())->toBeInstanceOf(Discharge::class);
    expect(Vehicle::factory()->create())->toBeInstanceOf(Vehicle::class);
    expect(FollowUpFile::factory()->create())->toBeInstanceOf(FollowUpFile::class);
    expect(Survey::factory()->create())->toBeInstanceOf(Survey::class);
    expect(SurveyCheckpoint::factory()->create())->toBeInstanceOf(SurveyCheckpoint::class);
    expect(SurveyCheckpointStep::factory()->create())->toBeInstanceOf(SurveyCheckpointStep::class);
    expect(Photo::factory()->create())->toBeInstanceOf(Photo::class);
    expect(Document::factory()->create())->toBeInstanceOf(Document::class);
    expect(Parking::factory()->create())->toBeInstanceOf(Parking::class);
    expect(Movement::factory()->create())->toBeInstanceOf(Movement::class);
});
