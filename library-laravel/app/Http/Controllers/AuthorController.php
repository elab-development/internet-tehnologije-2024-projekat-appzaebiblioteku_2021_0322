<?php

namespace App\Http\Controllers;

use App\Http\Resources\Author\AuthorCollection;
use App\Http\Resources\Author\AuthorResource;
use App\Models\Author;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AuthorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $authors = Author::all();
        if (is_null($authors) || count($authors) === 0) {
            return response()->json('No authors found!', 404);
        }
        return response()->json([
            'authors' => new AuthorCollection($authors)
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
            'name' => 'required|string|max:255|unique:authors',
            'birth' => 'required|date',
            'nationality' => 'required|string|max:255'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors());
        }

        $author = Author::create([
            'name' => $request->name,
            'birth' => $request->birth,
            'nationality' => $request->nationality,
        ]);

        return response()->json([
            'message' => 'Author inserted',
            'author' => new AuthorResource($author)
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show($author_id)
    {
        $author = Author::find($author_id);
        if (is_null($author)) {
            return response()->json('Author not found', 404);
        }
        return response()->json([
            'author' => new AuthorResource($author)
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Author $author)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Author $author)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'birth' => 'required|date',
            'nationality' => 'required|string|max:255'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors());
        }

        $author->name = $request->name;
        $author->birth = $request->birth;
        $author->nationality = $request->nationality;

        $author->save();

        return response()->json([
            'message' => 'Author updated',
            'author' => new AuthorResource($author)
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Author $author)
    {
        $author->delete();
        return response()->json('Author deleted');
    }
}
