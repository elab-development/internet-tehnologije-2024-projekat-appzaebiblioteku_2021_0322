<?php

namespace Database\Seeders;

use App\Models\Genre;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class GenreSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Genre::factory(1)->create([
            'name' => 'fantasy'
        ]);
        Genre::factory(1)->create([
            'name' => 'drama'
        ]);
        Genre::factory(1)->create([
            'name' => 'sci-fi'
        ]);
    }
}
