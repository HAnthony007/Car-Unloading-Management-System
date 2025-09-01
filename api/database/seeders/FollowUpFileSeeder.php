<?php

namespace Database\Seeders;

use App\Models\FollowUpFile;
use Illuminate\Database\Seeder;

class FollowUpFileSeeder extends Seeder
{
    public function run(): void
    {
        FollowUpFile::factory()->count(5)->create();
    }
}
