<?php

namespace App\Http\Controllers;

use App\Http\Resources\Book\BookCollection;
use App\Http\Resources\Book\BookResource;
use App\Models\Author;
use App\Models\Book;
use App\Models\Genre;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class BookController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $books = Book::all();
        if (is_null($books) || count($books) === 0) {
            return response()->json('No books found!', 404);
        }
        return response()->json([
            'books' => new BookCollection($books)
        ]);
    }

    /**
     * Pagination function, default 10.
     */
    public function pagination($page, Request $request)
    {
        $perPage = $request->query('per_page', 10);
        $skip = ($page - 1) * $perPage;

        $books = Book::skip($skip)->take($perPage)->get();

        if (is_null($books) || count($books) === 0) {
            return response()->json('No books found!', 404);
        }
        return response()->json([
            'books' => new BookCollection($books)
        ]);
    }

    /**
     * Filtering function. Filters for title, abstract, published, pages, and price.
     */
    public function filter(Request $request)
    {
        $query = Book::query();

        if ($request->has('title')) {
            $query->where('title', 'like', '%' . $request->title . '%');
        }

        if ($request->has('abstract')) {
            $query->where('abstract', 'like', '%' . $request->abstract . '%');
        }

        if ($request->has('published')) {
            $query->where('published', $request->published);
        }

        if ($request->has('price_min') && $request->has('price_max')) {
            $query->whereBetween('price', [$request->price_min, $request->price_max]);
        } elseif ($request->has('price_min')) {
            $query->where('price', '>=', $request->price_min);
        } elseif ($request->has('price_max')) {
            $query->where('price', '<=', $request->price_max);
        }

        if ($request->has('pages_min') && $request->has('pages_max')) {
            $query->whereBetween('pages', [$request->pages_min, $request->pages_max]);
        } elseif ($request->has('pages_min')) {
            $query->where('pages', '>=', $request->pages_min);
        } elseif ($request->has('pages_max')) {
            $query->where('pages', '<=', $request->pages_max);
        }

        $books = $query->get();
        $count = $books->count();

        return response()->json([
            'count' => $count,
            'books' => new BookCollection($books)
        ]);
    }

    /**
     * Search function. Search by title, abstract, author name, genre name
     */
    public function search(Request $request)
    {
        $queryTerm = $request->input('q'); // Get the search term from the 'q' parameter

        if (!$queryTerm) {
            return response()->json([
                'message' => 'Please provide a search term.',
                'books' => [],
            ], 400);
        }

        $books = Book::where('title', 'like', '%' . $queryTerm . '%')
            ->orWhere('abstract', 'like', '%' . $queryTerm . '%')
            ->orWhereHas('author', function ($query) use ($queryTerm) {
                $query->where('name', 'like', '%' . $queryTerm . '%');
            })
            ->orWhereHas('genre', function ($query) use ($queryTerm) {
                $query->where('name', 'like', '%' . $queryTerm . '%');
            })
            ->get();

        $count = $books->count();

        return response()->json([
            'count' => $count,
            'books' => new BookCollection($books)
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'abstract' => 'required|string|max:255',
            'published' => 'required|integer|between:1400,2023',
            'pages' => 'required|integer|between:20,1000',
            'price' => 'required|numeric|min:10|max:150',
            'author_id' => 'required|integer',
            'genre_id' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors());
        }

        $author = Author::find($request->author_id);
        if (is_null($author)) {
            return response()->json('No such author exist', 404);
        }
        $genre = Genre::find($request->genre_id);
        if (is_null($genre)) {
            return response()->json('No such genre exist', 404);
        }

        $book = Book::create([
            'title' => $request->title,
            'abstract' => $request->abstract,
            'published' => $request->published,
            'pages' => $request->pages,
            'price' => $request->price,
            'author_id' => $request->author_id,
            'genre_id' => $request->genre_id,
        ]);

        return response()->json([
            'message' => 'Book inserted',
            'book' => new BookResource($book)
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show($book_id)
    {
        $book = Book::find($book_id);
        if (is_null($book)) {
            return response()->json('Book not found', 404);
        }
        return response()->json([
            'book' => new BookResource($book)
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Book $book)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Book $book)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'abstract' => 'required|string|max:255',
            'published' => 'required|integer|between:1400,2023',
            'pages' => 'required|integer|between:20,1000',
            'price' => 'required|numeric|min:10|max:150',
            'author_id' => 'required|integer',
            'genre_id' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors());
        }

        $author = Author::find($request->author_id);
        if (is_null($author)) {
            return response()->json('No such author exist', 404);
        }
        $genre = Genre::find($request->genre_id);
        if (is_null($genre)) {
            return response()->json('No such genre exist', 404);
        }

        $book->title = $request->title;
        $book->abstract = $request->abstract;
        $book->published = $request->published;
        $book->pages = $request->pages;
        $book->price = $request->price;
        $book->author_id = $request->author_id;
        $book->genre_id = $request->genre_id;

        $book->save();

        return response()->json([
            'message' => 'Book updated',
            'book' => new BookResource($book)
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Book $book)
    {
        $book->delete();
        return response()->json('Book was deleted');
    }
}
