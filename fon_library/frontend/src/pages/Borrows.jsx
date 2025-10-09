import { useEffect } from 'react';

import { useBorrowStore } from '../store/borrowStore';
import LoadingSpinnerSection from '../components/loading/LoadingSpinnerSection';

const Borrows = () => {
  const { userBorrows, fetchUserBorrows, returnBorrow, isLoading } =
    useBorrowStore();

  useEffect(() => {
    fetchUserBorrows();
  }, [fetchUserBorrows]);

  const statusClass = {
    overdue: 'text-red-600 bg-red-100',
    borrowed: 'text-yellow-600 bg-yellow-100',
    returned: 'text-green-600 bg-green-100',
  };

  const handleReturn = async (borrowId) => {
    await returnBorrow(borrowId);
  };

  return (
    <>
      {isLoading ? (
        <LoadingSpinnerSection />
      ) : (
        <div className='max-w-7xl mx-auto px-4 sm:px-8 py-8'>
          <h2 className='text-2xl font-semibold mb-6 text-gray-800 dark:text-white'>
            My Borrowed Books
          </h2>
          {userBorrows.length === 0 ? (
            <p className='text-gray-500 dark:text-gray-300'>
              No borrow records found.
            </p>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {userBorrows.map((borrow) => (
                <div
                  key={borrow._id}
                  className='bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 flex flex-col gap-2'
                >
                  <div className='flex gap-4'>
                    <img
                      src={borrow.book.coverImageUrl}
                      alt={borrow.book.title}
                      className='h-24 w-16 object-cover rounded'
                    />
                    <div>
                      <h3 className='line-clamp-2 text-lg font-bold text-purple-700 dark:text-purple-400'>
                        {borrow.book.title}
                      </h3>
                      <p className='text-sm text-gray-600 dark:text-gray-300'>
                        by {borrow.book.author}
                      </p>
                      <span
                        className={`inline-block mt-2 px-2 py-1 text-xs font-medium rounded-full ${
                          statusClass[borrow.status]
                        }`}
                      >
                        {borrow.status}
                      </span>
                    </div>
                  </div>
                  <div className='flex flex-row justify-between items-center mt-4'>
                    <div className='mt-2 text-sm text-gray-700 dark:text-gray-300'>
                      <p>
                        <strong>Borrowed:</strong>{' '}
                        {new Date(borrow.borrowDate).toLocaleDateString()}
                      </p>
                      <p>
                        <strong>Due:</strong>{' '}
                        {new Date(borrow.dueDate).toLocaleDateString()}
                      </p>
                      <p>
                        <strong>Returned:</strong>{' '}
                        {borrow.returnDate
                          ? new Date(borrow.returnDate).toLocaleDateString()
                          : 'Not returned'}
                      </p>
                    </div>

                    {(borrow.status === 'borrowed' ||
                      borrow.status === 'overdue') && (
                      <button
                        onClick={() => handleReturn(borrow._id)}
                        className='cursor-pointer mt-3 self-start px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded hover:bg-purple-700 transition'
                      >
                        Return Book
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Borrows;
