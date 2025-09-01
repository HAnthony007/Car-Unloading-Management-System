<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Always create a fixed admin account
        User::insert([
            [
                'matriculation_no' => 'ADM001',
                'full_name' => 'RAKOTO Harifetra',
                'email' => 'admin@gmail.com',
                'password' => Hash::make('admin123'),
                'avatar' => '',
                'phone' => '0345511784',
                'role_id' => 1,
            ],
        ]);
        User::factory()->count(15)->create();
    }
}
