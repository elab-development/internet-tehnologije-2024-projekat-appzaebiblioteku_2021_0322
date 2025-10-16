import { useEffect, useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { FiMoreVertical } from 'react-icons/fi';
import { IoClose } from 'react-icons/io5';

import { useBookStore } from '../../../store/bookStore';
import { useGenreStore } from '../../../store/genreStore';
import LoadingSpinnerSection from '../../loading/LoadingSpinnerSection';

const BooksManager = () => {
  const {
    allBooks: books,
    isLoading,
    fetchBooks,
    createBook,
    updateBook,
    deleteBook,
  } = useBookStore();

  const { genres, fetchGenres } = useGenreStore();

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    genre: '',
    totalCopies: '',
    availableCopies: '',
    publishedYear: '',
    cover: null,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState({ id: '', title: '' });

  const [moreInfoModal, setMoreInfoModal] = useState(false);
  const [moreInfo, setMoreInfo] = useState({
    cover: '',
    author: '',
    availableCopies: 0,
    totalCopies: 0,
    publishedYear: 0,
  });

  useEffect(() => {
    fetchBooks();
    fetchGenres();
  }, []);

  const openCreateModal = () => {
    setFormData({
      title: '',
      author: '',
      description: '',
      genre: '',
      totalCopies: '',
      availableCopies: '',
      publishedYear: '',
      cover: null,
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const openEditModal = (book) => {
    setFormData({
      title: book.title,
      author: book.author,
      description: book.description,
      genre: book.genre._id,
      totalCopies: book.totalCopies,
      availableCopies: book.availableCopies,
      publishedYear: book.publishedYear,
      cover: null,
    });
    setEditingId(book._id);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== '') {
        payload.append(key, value);
      }
    });

    if (isEditing) {
      await updateBook(editingId, payload);
    } else {
      await createBook(payload);
    }
    setIsModalOpen(false);
  };

  const openDeleteModal = (book) => {
    setBookToDelete({ id: book._id, title: book.title });
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    await deleteBook(bookToDelete.id);
    setDeleteModalOpen(false);
  };

  const openMoreInfoModal = (book) => {
    setMoreInfoModal(true);
    setMoreInfo({
      cover: book.coverImageUrl,
      availableCopies: book.availableCopies,
      totalCopies: book.totalCopies,
      publishedYear: book.publishedYear,
      author: book.author,
    });
  };

  if (isLoading) return <LoadingSpinnerSection />;

  return (
    <div className='flex flex-col'>
      <div className='flex justify-between mb-4'>
        <h2 className='font-semibold text-2xl'>Book Manager</h2>
        <button
          onClick={openCreateModal}
          className='px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700'
        >
          Create Book
        </button>
      </div>

      <div className='relative overflow-x-auto shadow-md sm:rounded-lg'>
        <table className='w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400'>
          <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
            <tr>
              <th className='px-6 py-3'>Title</th>
              <th className='px-6 py-3 hidden sm:table-cell'>Author</th>
              <th className='px-6 py-3 hidden sm:table-cell'>Genre</th>
              <th className='px-6 py-3'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr
                key={book._id}
                className='odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200'
              >
                <td className='px-6 py-4 font-medium text-gray-900 dark:text-white'>
                  {book.title}
                </td>
                <td className='px-6 py-4 hidden sm:table-cell'>
                  {book.author}
                </td>
                <td className='px-6 py-4 hidden sm:table-cell'>
                  {book.genre?.name}
                </td>
                <td className='px-6 py-4 flex gap-4'>
                  <button
                    onClick={() => openEditModal(book)}
                    className='cursor-pointer text-blue-600 dark:text-blue-500'
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => openDeleteModal(book)}
                    className='cursor-pointer text-red-600 dark:text-red-500'
                  >
                    <FaTrash />
                  </button>
                  <button
                    onClick={() => openMoreInfoModal(book)}
                    className='cursor-pointer text-gray-600 dark:text-gray-400'
                  >
                    <FiMoreVertical />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className='fixed inset-0 z-50 bg-black/50 flex items-center justify-center'>
          <div className='bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-lg'>
            <h3 className='text-lg font-semibold mb-4 text-gray-900 dark:text-white'>
              {isEditing ? 'Edit Book' : 'Create Book'}
            </h3>
            <form onSubmit={handleSubmit} className='space-y-3'>
              {[
                'title',
                'author',
                'description',
                'totalCopies',
                'availableCopies',
                'publishedYear',
              ].map((field) => (
                <div key={field}>
                  <label className='block text-sm font-medium text-gray-700 dark:text-white capitalize'>
                    {field.replace(/([A-Z])/g, ' $1')}
                  </label>
                  <input
                    type={
                      field.includes('Copies') || field === 'publishedYear'
                        ? 'number'
                        : 'text'
                    }
                    value={formData[field]}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        [field]: e.target.value,
                      }))
                    }
                    required={field !== 'description'}
                    className='mt-1 block w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white'
                  />
                </div>
              ))}

              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-white'>
                  Genre
                </label>
                <select
                  value={formData.genre}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, genre: e.target.value }))
                  }
                  required
                  className='mt-1 block w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white'
                >
                  <option value=''>Select Genre</option>
                  {genres.map((g) => (
                    <option key={g._id} value={g._id}>
                      {g.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-white'>
                  Cover Image
                </label>
                <input
                  type='file'
                  accept='image/*'
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      cover: e.target.files[0],
                    }))
                  }
                  className='block w-full mt-1'
                />
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

      {/* Delete Modal */}
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
                Are you sure you want to delete "{bookToDelete.title}"?
              </h3>
              <button
                onClick={confirmDelete}
                className='cursor-pointer text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center me-2 dark:bg-red-500 dark:hover:bg-red-700 dark:focus:ring-red-800'
              >
                Yes, I'm sure
              </button>
              <button
                onClick={() => setDeleteModalOpen(false)}
                className='cursor-pointer py-2.5 px-5 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100  focus:outline-none focus:ring-4 focus:ring-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700'
              >
                No, cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* More Info Modal */}
      {moreInfoModal && (
        <div className='fixed inset-0 z-50 bg-black/50 flex items-center justify-center'>
          <div className='bg-white dark:bg-gray-800 p-6 rounded-lg'>
            <div className='flex flex-row justify-between items-center'>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
                More Information
              </h3>
              <IoClose
                onClick={() => setMoreInfoModal(false)}
                className='cursor-pointer pb-3'
                size={32}
              />
            </div>

            <div className='flex flex-row space-x-4'>
              <img
                src={moreInfo.cover}
                alt='Book Cover'
                className='h-[250px] rounded mb-4'
              />
              <div className='space-y-4'>
                <p className='block sm:hidden'>
                  <strong>Author:</strong> {moreInfo.author}
                </p>
                <p>
                  <strong>Available Copies:</strong> {moreInfo.availableCopies}
                </p>
                <p>
                  <strong>Total Copies:</strong> {moreInfo.totalCopies}
                </p>
                <p>
                  <strong>Published Year:</strong> {moreInfo.publishedYear}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BooksManager;
