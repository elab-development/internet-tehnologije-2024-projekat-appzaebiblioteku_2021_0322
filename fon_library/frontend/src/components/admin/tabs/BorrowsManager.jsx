import { useEffect, useState } from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';

import { useBorrowStore } from '../../../store/borrowStore';
import LoadingSpinnerSection from '../../loading/LoadingSpinnerSection';

const BorrowsManager = () => {
  const [actionLoading, setActionLoading] = useState(null);

  const { borrows, fetchAllBorrows, markAsOverdue, isLoading, error } =
    useBorrowStore();

  useEffect(() => {
    fetchAllBorrows();
  }, []);

  const handleMarkOverdue = async (borrowId) => {
    setActionLoading(borrowId);
    await markAsOverdue(borrowId);
    setActionLoading(null);
  };

  const statusClass = {
    overdue: 'text-red-600 bg-red-100',
    borrowed: 'text-yellow-600 bg-yellow-100',
    returned: 'text-green-600 bg-green-100',
  };

  if (isLoading) return <LoadingSpinnerSection />;
  if (error) return <p className='text-red-600'>{error}</p>;

  return (
    <div className='flex flex-col'>
      <h2 className='text-2xl font-semibold mb-6 text-gray-800 dark:text-white'>
        Borrows Manager
      </h2>

      <div className='relative overflow-x-auto shadow-md sm:rounded-lg'>
        <table className='w-full text-sm text-left text-gray-500 dark:text-gray-400'>
          <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
            <tr>
              <th className='px-6 py-3'>User</th>
              <th className='px-6 py-3'>Book</th>
              <th className='px-6 py-3'>Borrowed</th>
              <th className='px-6 py-3'>Due</th>
              <th className='px-6 py-3'>Returned</th>
              <th className='px-6 py-3'>Status</th>
              <th className='px-6 py-3'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {borrows.map((borrow) => (
              <tr
                key={borrow._id}
                className='odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200'
              >
                <td className='px-6 py-4 font-medium text-gray-900 dark:text-white'>
                  {borrow.user?.name} <br />
                  <span className='text-xs text-gray-400'>
                    {borrow.user?.email}
                  </span>
                </td>
                <td className='line-clamp-2 px-6 py-4'>
                  {borrow.book?.title || '—'}
                </td>
                <td className='px-6 py-4'>
                  {new Date(borrow.borrowDate).toLocaleDateString()}
                </td>
                <td className='px-6 py-4'>
                  {new Date(borrow.dueDate).toLocaleDateString()}
                </td>
                <td className='px-6 py-4'>
                  {borrow.returnDate
                    ? new Date(borrow.returnDate).toLocaleDateString()
                    : '—'}
                </td>
                <td className='px-6 py-4'>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      statusClass[borrow.status]
                    }`}
                  >
                    {borrow.status}
                  </span>
                </td>
                <td className='px-6 py-4'>
                  {borrow.status === 'borrowed' &&
                    borrow.dueDate < new Date().toISOString() && (
                      <button
                        onClick={() => handleMarkOverdue(borrow._id)}
                        disabled={actionLoading === borrow._id}
                        className='cursor-pointer text-red-600 hover:underline flex items-center gap-1 disabled:opacity-50'
                      >
                        <FaExclamationTriangle /> Mark Overdue
                      </button>
                    )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BorrowsManager;
