<?php

namespace Database\Seeders;

use App\Models\Author;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AuthorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Author::factory(1)->create([
            'name' => 'J.K.Rowling',
            'nationality' => 'England',
            'birth' => '1965-07-31',
        ]);
    }
}
