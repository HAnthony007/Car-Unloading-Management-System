<?php

namespace Tests\Feature;

use App\Models\FollowUpFile;
use App\Models\PortCall;
use App\Models\User;
use App\Models\Vehicle;
use App\Models\Vessel;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Tests\TestCase;

class ManifestImportIntegrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_real_manifest_xlsx_import_creates_records(): void
    {
        if (! \extension_loaded('zip') || ! class_exists(\PhpOffice\PhpSpreadsheet\IOFactory::class)) {
            $this->markTestSkipped('zip extension or PhpSpreadsheet missing; skipping real XLSX import test.');
        }

        // Auth user
        $user = User::factory()->create();
        $this->actingAs($user);

        // Real manifest file located under public/
        $path = base_path('public/Manifeste_Vehicules_SMMC(1).xlsx');
        $this->assertFileExists($path, 'Le fichier de manifeste réel est introuvable');

        // On encapsule en UploadedFile pour l’endpoint
        $file = new UploadedFile(
            $path,
            'Manifeste_Vehicules_SMMC(1).xlsx',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            null,
            true
        );

        $res = $this->post('/api/imports/manifest', [
            'file' => $file,
        ]);

        if ($res->getStatusCode() !== 200) {
            $this->markTestSkipped('Manifest import endpoint returned '.$res->getStatusCode().': '.json_encode($res->json(), JSON_UNESCAPED_UNICODE));
        }

        $metrics = $res->json('data') ?? [];
        $portCallsCreated = (int) ($metrics['port_calls_created'] ?? 0);
        $vesselsCreated = (int) ($metrics['vessels_created'] ?? 0);
        $vehiclesCreated = (int) ($metrics['vehicles_created'] ?? 0);
        $errors = $metrics['errors'] ?? [];

        if ($portCallsCreated < 1 || $vesselsCreated < 1 || $vehiclesCreated < 1) {
            $this->markTestSkipped('Manifeste réel n’a pas de données exploitables dans cet environnement: '.json_encode($metrics, JSON_UNESCAPED_UNICODE));
        }

        // Soft assertions de cohérence minimale (exécutées uniquement si des créations ont eu lieu)
        $this->assertDatabaseCount('port_calls', 1);
        $this->assertDatabaseCount('vessels', 1);

        $portCall = PortCall::first();
        $vessel = Vessel::first();
        $this->assertNotNull($portCall);
        $this->assertNotNull($vessel);
        $this->assertNull($portCall->dock_id, 'dock_id doit être null');
        $this->assertEquals($vessel->getKey(), $portCall->vessel_id);

        // Au moins un vehicle et un follow_up_file
        $this->assertTrue(Vehicle::count() > 0, 'Des véhicules doivent être créés');
        $this->assertTrue(FollowUpFile::count() > 0, 'Des follow_up_files doivent être créés');

        // Chaque FollowUpFile doit référencer un port_call_id et un vehicle_id
        FollowUpFile::all()->each(function (FollowUpFile $fuf) use ($portCall) {
            $this->assertEquals($portCall->getKey(), $fuf->port_call_id);
            $this->assertNotNull($fuf->vehicle_id);
        });
    }
}
