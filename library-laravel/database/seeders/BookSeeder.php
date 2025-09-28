<?php

namespace Database\Seeders;

use App\Models\Author;
use App\Models\Book;
use App\Models\Genre;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BookSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $authorJKR = Author::where('name', '=', 'J.K.Rowling')->firstOrFail();
        $genreFantasy = Genre::where('name', '=', 'fantasy')->firstOrFail();

        Book::factory(1)->create([
            'author_id' => $authorJKR->id,
            'genre_id' => $genreFantasy->id,
            'title' => 'Harry Potter and the Philosopher`s Stone',
            'published' => 1997,
        ]);
        Book::factory(1)->create([
            'author_id' => $authorJKR->id,
            'genre_id' => $genreFantasy->id,
            'title' => 'Harry Potter and the Chamber of Secrets',
            'published' => 1998,
        ]);
        Book::factory(1)->create([
            'author_id' => $authorJKR->id,
            'genre_id' => $genreFantasy->id,
            'title' => 'Harry Potter and the Prisoner of Azkaban',
            'published' => 1999,
        ]);
        Book::factory(1)->create([
            'author_id' => $authorJKR->id,
            'genre_id' => $genreFantasy->id,
            'title' => 'Harry Potter and the Goblet of Fire',
            'published' => 2000,
        ]);
        Book::factory(1)->create([
            'author_id' => $authorJKR->id,
            'genre_id' => $genreFantasy->id,
            'title' => 'Harry Potter and the Order of the Phoenix',
            'published' => 2003,
        ]);
        Book::factory(1)->create([
            'author_id' => $authorJKR->id,
            'genre_id' => $genreFantasy->id,
            'title' => 'Harry Potter and the Half-Blood Prince',
            'published' => 2005,
        ]);
        Book::factory(1)->create([
            'author_id' => $authorJKR->id,
            'genre_id' => $genreFantasy->id,
            'title' => 'Harry Potter and the Deathly Hallows',
            'published' => 2007,
        ]);
    }
}
