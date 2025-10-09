import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { useBookStore } from '../store/bookStore';
import { useAuthStore } from '../store/authStore';
import LoadingSpinnerSection from '../components/loading/LoadingSpinnerSection';
import { useState } from 'react';
import { useBorrowStore } from '../store/borrowStore';

const BookDetails = () => {
  const [canBorrow, setCanBorrow] = useState(false);

  const { selectedBook, isLoading, error, getBookById } = useBookStore();
  const { isAuthenticated, user } = useAuthStore();
  const {
    checkBorrowStatus,
    createBorrow,
    isLoading: isBorrowLoading,
  } = useBorrowStore();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      getBookById(id);
    }
  }, [id, getBookById]);

  useEffect(() => {
    const checkBooksBorrowStatus = async () => {
      if (id && isAuthenticated) {
        const borrowed = await checkBorrowStatus(id);
        setCanBorrow(!borrowed);
      }
    };
    checkBooksBorrowStatus();
  }, [id, isAuthenticated, checkBorrowStatus]);

  const borrowBook = async () => {
    if (selectedBook && isAuthenticated && canBorrow) {
      await createBorrow({
        book: selectedBook._id,
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
      });
      setCanBorrow(false);
      await getBookById(id); // Refresh book details after borrowing
    }
  };

  return (
    <>
      {isLoading ? (
        <LoadingSpinnerSection />
      ) : (
        <>
          {error || !selectedBook ? (
            <div className='h-screen flex items-center justify-center'>
              <h2 className='text-2xl font-semibold text-red-600'>
                {error || 'Book not found'}
              </h2>
            </div>
          ) : (
            <div className='bg-slate-50 min-h-screen py-10 px-4'>
              <div className='max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row gap-6 p-6'>
                <div className='w-full md:w-1/3 flex justify-center items-start'>
                  <img
                    src={selectedBook.coverImageUrl}
                    alt={selectedBook.title}
                    className='w-52 h-auto object-cover rounded shadow'
                  />
                </div>

                <div className='flex-1 space-y-4'>
                  <h1 className='text-2xl font-bold text-purple-700 dark:text-purple-400'>
                    {selectedBook.title}
                  </h1>

                  <p className='text-gray-700 dark:text-gray-300'>
                    <span className='font-semibold text-gray-900 dark:text-white'>
                      Author:
                    </span>{' '}
                    {selectedBook.author}
                  </p>

                  <p className='text-gray-700 dark:text-gray-300'>
                    <span className='font-semibold text-gray-900 dark:text-white'>
                      Available Copies:
                    </span>{' '}
                    {selectedBook.availableCopies}
                  </p>

                  <p className='text-gray-700 dark:text-gray-300'>
                    <span className='font-semibold text-gray-900 dark:text-white'>
                      Published:
                    </span>{' '}
                    {selectedBook.publishedYear}
                  </p>

                  {selectedBook.description && (
                    <p className='text-gray-600 dark:text-gray-400 text-sm'>
                      {selectedBook.description}
                    </p>
                  )}

                  {selectedBook.availableCopies <= 0 ? (
                    <p className='text-red-600 text-sm mt-4'>
                      This book is currently not available for borrowing.
                    </p>
                  ) : isAuthenticated && !user.isAdmin ? (
                    <button
                      onClick={borrowBook}
                      disabled={isBorrowLoading || !canBorrow}
                      className='cursor-pointer mt-4 px-6 py-2 disabled:cursor-default disabled:opacity-40 bg-purple-600 text-white rounded hover:bg-purple-700 transition duration-200'
                    >
                      {isBorrowLoading ? (
                        <LoadingSpinnerSection />
                      ) : canBorrow ? (
                        'Borrow Book'
                      ) : (
                        'Already Borrowed'
                      )}
                    </button>
                  ) : !isAuthenticated ? (
                    <p className='text-sm'>Please log in to borrow books.</p>
                  ) : null}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default BookDetails;
