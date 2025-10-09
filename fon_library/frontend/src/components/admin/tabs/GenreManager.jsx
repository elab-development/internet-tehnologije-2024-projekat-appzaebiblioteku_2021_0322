import { useEffect, useState } from 'react';
import { useGenreStore } from '../../../store/genreStore';
import LoadingSpinnerSection from '../../loading/LoadingSpinnerSection';
import { FaEdit, FaTrash } from 'react-icons/fa';

const GenreManager = () => {
  const {
    genres,
    isLoading,
    fetchGenres,
    createGenre,
    updateGenre,
    deleteGenre,
  } = useGenreStore();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [genreToDelete, setGenreToDelete] = useState({ id: '', name: '' });

  useEffect(() => {
    fetchGenres();
  }, []);

  const openCreateModal = () => {
    setName('');
    setDescription('');
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const openEditModal = (genre) => {
    setName(genre.name);
    setDescription(genre.description);
    setEditingId(genre._id);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { name, description };
    if (isEditing) {
      await updateGenre(editingId, payload);
    } else {
      await createGenre(payload);
    }
    setIsModalOpen(false);
  };

  const openDeleteModal = (genre) => {
    setGenreToDelete({ id: genre._id, name: genre.name });
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    await deleteGenre(genreToDelete.id);
    setDeleteModalOpen(false);
  };

  if (isLoading) return <LoadingSpinnerSection />;

  return (
    <div className='flex flex-col'>
      <div className='flex flex-row justify-between mb-4'>
        <h2 className='font-semibold text-2xl'>Genre Manager</h2>
        <button
          onClick={openCreateModal}
          className='cursor-pointer px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700'
        >
          Create Genre
        </button>
      </div>

      <div className='relative overflow-x-auto shadow-md sm:rounded-lg'>
        <table className='w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400'>
          <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
            <tr>
              <th className='px-6 py-3'>Name</th>
              <th className='px-6 py-3 hidden sm:table-cell'>Description</th>
              <th className='px-6 py-3'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {genres.map((genre) => (
              <tr
                key={genre._id}
                className='odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200'
              >
                <td className='px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                  {genre.name}
                </td>
                <td className='px-6 py-4 hidden sm:table-cell'>
                  {genre.description}
                </td>
                <td className='px-6 py-4 flex gap-4'>
                  <button
                    onClick={() => openEditModal(genre)}
                    className='cursor-pointer text-blue-600 dark:text-blue-500 hover:underline'
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => openDeleteModal(genre)}
                    className='cursor-pointer text-red-600 dark:text-red-500 hover:underline'
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className='fixed inset-0 z-50 bg-black/50 flex items-center justify-center'>
          <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md'>
            <h3 className='text-lg font-semibold mb-4 text-gray-900 dark:text-white'>
              {isEditing ? 'Edit Genre' : 'Create Genre'}
            </h3>
            <form onSubmit={handleSubmit} className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-white'>
                  Name
                </label>
                <input
                  type='text'
                  className='mt-1 block w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-white'>
                  Description
                </label>
                <textarea
                  className='mt-1 block w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white'
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>
              <div className='flex justify-end gap-2'>
                <button
                  type='button'
                  onClick={() => setIsModalOpen(false)}
                  className='cursor-pointer px-4 py-2 bg-gray-300 dark:bg-gray-600 text-black dark:text-white rounded'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  className='cursor-pointer px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700'
                >
                  {isEditing ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className='fixed inset-0 z-50 bg-black/50 flex items-center justify-center'>
          <div className='relative bg-white rounded-lg shadow-sm dark:bg-gray-700 w-full max-w-md'>
            <div className='p-4 md:p-5 text-center'>
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
                Are you sure you want to delete "{genreToDelete.name}"?
              </h3>
              <button
                onClick={confirmDelete}
                className='cursor-pointer text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center me-2 dark:bg-red-500 dark:hover:bg-red-700 dark:focus:ring-red-800'
              >
                Yes, I'm sure
              </button>
              <button
                onClick={() => setDeleteModalOpen(false)}
                className='cursor-pointer py-2.5 px-5 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700'
              >
                No, cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenreManager;
