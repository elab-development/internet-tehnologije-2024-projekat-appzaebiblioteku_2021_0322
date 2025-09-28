<?php

namespace App\Http\Resources\Book;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BookResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'title' => $this->resource->title,
            'author' => $this->resource->author->name,
            'abstract' => $this->resource->abstract,
            'genre' => $this->resource->genre->name,
            'published' => $this->resource->published,
            'price' => $this->resource->price,
            'pages' => $this->resource->pages,
        ];
    }
}
