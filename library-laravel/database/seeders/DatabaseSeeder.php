<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Author;
use App\Models\Book;
use App\Models\Genre;
use App\Models\User;
use Illuminate\Database\Seeder;
class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory(5)->create();
        Author::factory(10)->create();
        Genre::factory(5)->create();
        Book::factory(2)->create([
            'author_id' => 1,
            'genre_id' => 1,
        ]);
        Book::factory(3)->create([
            'author_id' => 2,
            'genre_id' => 1,
        ]);
        Book::factory(2)->create([
            'author_id' => 3,
            'genre_id' => 2,
        ]);
        Book::factory(3)->create([
            'author_id' => 4,
            'genre_id' => 2,
        ]);
        Book::factory(2)->create([
            'author_id' => 5,
            'genre_id' => 3,
        ]);
        Book::factory(3)->create([
            'author_id' => 6,
            'genre_id' => 3,
        ]);
        Book::factory(2)->create([
            'author_id' => 7,
            'genre_id' => 4,
        ]);
        Book::factory(3)->create([
            'author_id' => 8,
            'genre_id' => 4,
        ]);
        Book::factory(2)->create([
            'author_id' => 9,
            'genre_id' => 5,
        ]);
        Book::factory(3)->create([
            'author_id' => 10,
            'genre_id' => 5,
        ]);

        $this->call([
            AuthorSeeder::class,
        ]);

        $this->call([
            GenreSeeder::class,
        ]);

        $this->call([
            BookSeeder::class,
        ]);
    }
}
