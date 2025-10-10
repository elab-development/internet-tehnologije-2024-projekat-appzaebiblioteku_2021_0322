import { useEffect, useState } from 'react';
import { useUserStore } from '../../../store/userStore';
import { useAuthStore } from '../../../store/authStore';
import LoadingSpinnerSection from '../../loading/LoadingSpinnerSection';

const UsersManager = () => {
  const {
    users,
    fetchUsers,
    updateUserRole,
    fetchBorrowStats,
    userBorrowStats,
    isLoading,
  } = useUserStore();
  const { user: currentUser } = useAuthStore();

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    users.forEach((user) => {
      if (!userBorrowStats[user._id]) {
        fetchBorrowStats(user._id);
      }
    });
  }, [users]);

  const openConfirmModal = (user) => {
    setSelectedUser(user);
    setConfirmModalOpen(true);
  };

  const confirmChangeRole = async () => {
    await updateUserRole(selectedUser._id, {
      isAdmin: !selectedUser.isAdmin,
    });
    setConfirmModalOpen(false);
  };

  if (isLoading) return <LoadingSpinnerSection />;

  // Make current user first in the list
  const sortedUsers = [...users].sort((a, b) =>
    a._id === currentUser._id ? -1 : b._id === currentUser._id ? 1 : 0
  );

  return (
    <div className='flex flex-col'>
      <h2 className='font-semibold text-2xl mb-4'>Users Manager</h2>

      <div className='relative overflow-x-auto shadow-md sm:rounded-lg'>
        <table className='w-full text-sm text-left text-gray-500 dark:text-gray-400'>
          <thead className='...'>
            <tr>
              <th className='px-6 py-3'>Name</th>
              <th className='px-6 py-3'>Email</th>
              <th className='px-6 py-3'>Role</th>
              <th className='px-6 py-3'>Borrow Stats</th>
              <th className='px-6 py-3'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedUsers.map((user) => {
              const stats = userBorrowStats[user._id] || {};
              return (
                <tr
                  key={user._id}
                  className='odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200'
                >
                  <td className='px-6 py-4 font-medium text-gray-900 dark:text-white'>
                    {user.name}
                  </td>
                  <td className='px-6 py-4'>{user.email}</td>
                  <td className='px-6 py-4'>
                    {user.isAdmin ? 'Admin' : 'User'}
                  </td>
                  <td className='px-6 py-4'>
                    {!user.isAdmin && (
                      <div className='text-xs text-gray-700 dark:text-gray-300 space-y-1'>
                        <div className='text-yellow-600'>
                          Borrowed: {stats.borrowed || 0}
                        </div>
                        <div className='text-green-600'>
                          Returned: {stats.returned || 0}
                        </div>
                        <div className='text-red-600'>
                          Overdue: {stats.overdue || 0}
                        </div>
                      </div>
                    )}
                  </td>
                  <td className='px-6 py-4'>
                    {user._id !== currentUser._id && (
                      <button
                        onClick={() => openConfirmModal(user)}
                        className='cursor-pointer text-blue-600 hover:underline dark:text-blue-500'
                      >
                        Change to {user.isAdmin ? 'User' : 'Admin'}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Confirmation Modal */}
      {confirmModalOpen && selectedUser && (
        <div className='fixed inset-0 z-50 bg-black/50 flex items-center justify-center'>
          <div className='bg-white dark:bg-gray-700 rounded-lg shadow p-6 w-full max-w-md text-center'>
            <svg
              className='mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 20 20'
            >
              <path
                stroke='currentColor'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
              />
            </svg>
            <h3 className='mb-5 text-lg font-normal text-gray-500 dark:text-gray-400'>
              Are you sure you want to change the role of "{selectedUser.name}"
              to {selectedUser.isAdmin ? 'User' : 'Admin'}?
            </h3>
            <button
              onClick={confirmChangeRole}
              className='cursor-pointer text-white bg-purple-600 hover:bg-purple-700 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 dark:bg-purple-500 dark:hover:bg-purple-600 dark:focus:ring-purple-800'
            >
              Yes, I’m sure
            </button>
            <button
              onClick={() => setConfirmModalOpen(false)}
              className='cursor-pointer py-2.5 px-5 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700'
            >
              No, cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersManager;
