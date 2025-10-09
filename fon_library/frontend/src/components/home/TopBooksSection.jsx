import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useBookStore } from '../../store/bookStore';
import LoadingSpinnerSection from '../loading/LoadingSpinnerSection';
import BookCoverPlaceholder from '../../assets/book_genre_placeholder.png';

const TopBooksSection = () => {
  const { topBooks, fetchTopBooks, isLoading } = useBookStore();
  const navigate = useNavigate();

  useEffect(() => {
    const getBooks = async () => {
      await fetchTopBooks();
    };
    getBooks();
  }, [fetchTopBooks]);

  const handleClick = (bookId) => {
    navigate(`/books/${bookId}`);
  };

  return (
    <>
      {isLoading ? (
        <LoadingSpinnerSection />
      ) : (
        <section className='max-w-7xl mx-auto px-4 sm:px-8 py-8'>
          {/* Title Section */}
          <div className='text-center mb-10'>
            <h2 className='text-3xl sm:text-4xl font-bold text-purple-700 dark:text-purple-400'>
              Top Available Books
            </h2>
            <p className='mt-2 text-gray-600 dark:text-gray-300 max-w-xl mx-auto text-sm sm:text-base'>
              Browse our most available titles — ready for you to borrow or
              explore.
            </p>
          </div>

          {/* Grid Section */}
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
            {topBooks.map((book) => (
              <div
                key={book._id}
                onClick={() => handleClick(book._id)}
                className='cursor-pointer bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-4 flex flex-col items-center text-center hover:scale-105 transform'
              >
                <img
                  src={book.coverImageUrl || BookCoverPlaceholder}
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
        </section>
      )}
    </>
  );
};

export default TopBooksSection;
