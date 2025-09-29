<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\AuthorController;
use App\Http\Controllers\BookController;
use App\Http\Controllers\GenreController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;



Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


Route::get('/books', [BookController::class, 'index']);
Route::get('/books/filter', [BookController::class, 'filter']);
Route::get('/books/search', [BookController::class, 'search']);
Route::get('/books/page/{page}', [BookController::class, 'pagination']);
Route::get('/books/{id}', [BookController::class, 'show']);


Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);


Route::group(['middleware' => ['auth:sanctum']], function () {
     Route::resource('books', BookController::class)
        ->only(['store', 'update', 'destroy']);


    Route::post('/logout', [AuthController::class, 'logout']);
});