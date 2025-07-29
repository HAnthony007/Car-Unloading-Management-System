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
         User::insert([
            [
                'matriculation_no' => 'ADM001',
                'full_name' => 'RAKOTO Harifetra',
                'email' => 'admin@gmail.com',
                'password' => Hash::make('admin123'),
                'avatar' => '',
                'phone' => '0345511784',
                'role_id' => 1
            ],
            [
                'matriculation_no' => 'AGT001',
                'full_name' => 'Rabe Anthony',
                'email' => 'agent@gmail.com',
                'password' => Hash::make('agent123'),
                'avatar' => '',
                'phone' => '0320228232',
                'role_id' => 2
            ],
        ]);
    }
}
