<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Book>
 */
class BookFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $numberOfWords = fake()->randomDigit() + 1;
        return [
            'title' => fake()->unique()->sentence($numberOfWords, true),
            'abstract' => fake()->text(255),
            'published' => fake()->numberBetween(1400, date("Y")),
            'pages' => fake()->numberBetween(20, 1000),
            'price' => fake()->randomFloat(2, 10, 150),
        ];
    }
}
