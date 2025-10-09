import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { IoIosSearch } from 'react-icons/io';

import { useBookStore } from '../store/bookStore';
import { useGenreStore } from '../store/genreStore';
import LoadingSpinnerSection from '../components/loading/LoadingSpinnerSection';

const Books = () => {
  const { books, fetchBooks, isLoading, page, totalPages } = useBookStore();
  const { genres, fetchGenres } = useGenreStore();
  const navigate = useNavigate();
  const location = useLocation();

  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('');
  const [sort, setSort] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchGenres();
  }, [fetchGenres]);

  useEffect(() => {
    const params = {
      page: currentPage,
      limit: 12,
      search,
      genre,
      sort,
    };
    fetchBooks(params);
  }, [search, genre, sort, currentPage, fetchBooks]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const genreQuery = params.get('genre') || '';
    setGenre(genreQuery);

    fetchBooks({
      page: 1,
      limit: 12,
      search: '',
      genre: genreQuery,
      sort: '',
    });
  }, [location.search, fetchBooks]);

  const handleClick = (bookId) => {
    navigate(`/books/${bookId}`);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className='bg-slate-50 min-h-screen'>
      <section className='max-w-7xl mx-auto px-4 sm:px-8 py-8'>
        {/* Filters */}
        <div className='flex flex-wrap gap-4 mb-6'>
          <div class='relative'>
            <div class='absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none'>
              <IoIosSearch />
            </div>
            <input
              type='text'
              placeholder='Search by title or author...'
              className='bg-white border w-full border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-500 dark:focus:border-purple-500'
              value={search}
              onChange={(e) => {
                setCurrentPage(1);
                setSearch(e.target.value);
              }}
            />
          </div>

          <select
            className='cursor-pointer bg-white border w-[250px] border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-500 dark:focus:border-purple-500'
            value={genre}
            onChange={(e) => {
              setCurrentPage(1);
              setGenre(e.target.value);
            }}
          >
            <option value=''>All Genres</option>
            {genres.map((g) => (
              <option key={g._id} value={g.name}>
                {g.name}
              </option>
            ))}
          </select>

          <select
            className='cursor-pointer bg-white border w-[250px] border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-500 dark:focus:border-purple-500'
            value={sort}
            onChange={(e) => {
              setCurrentPage(1);
              setSort(e.target.value);
            }}
          >
            <option value=''>Sort by</option>
            <option value='copies'>Most Available Copies</option>
            <option value='year'>Newest Published</option>
          </select>
        </div>

        {/* Books Grid */}
        {isLoading ? (
          <LoadingSpinnerSection />
        ) : (
          <>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
              {books.map((book) => (
                <div
                  key={book._id}
                  onClick={() => handleClick(book._id)}
                  className='cursor-pointer bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-4 flex flex-col items-center text-center hover:scale-105 transform'
                >
                  <img
                    src={book.coverImageUrl}
                    alt={book.title}
                    className='h-32 object-cover mb-4 rounded'
                  />
                  <h3 className='line-clamp-1 text-lg font-semibold text-purple-700 dark:text-purple-400 mb-1'>
                    {book.title}
                  </h3>
                  <p className='text-sm text-gray-600 dark:text-gray-300 mb-1'>
                    by {book.author}
                  </p>
                  <p className='text-xs text-gray-500 dark:text-gray-400'>
                    Available Copies: {book.availableCopies}
                  </p>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className='flex justify-center mt-8 gap-4'>
              <button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className='cursor-pointer px-3 py-1 bg-purple-600 text-white rounded disabled:opacity-50'
              >
                Previous
              </button>
              <span className='text-gray-700 dark:text-white self-center'>
                Page {page} of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className='cursor-pointer px-3 py-1 bg-purple-600 text-white rounded disabled:opacity-50'
              >
                Next
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default Books;
