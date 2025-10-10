import { useEffect } from 'react';
import { Book, BookType, Users } from 'lucide-react';

import { useGenreStore } from '../../store/genreStore';
import { useBookStore } from '../../store/bookStore';
import { useUserStore } from '../../store/userStore';
import LoadingSpinnerSection from '../loading/LoadingSpinnerSection';

const AdminDashboardSummaryCards = () => {
  const { fetchGenres, isLoading: genresLoading, genres } = useGenreStore();
  const {
    fetchBooksNoFilters,
    isLoading: booksLoading,
    allBooks,
  } = useBookStore();
  const { fetchUsers, isLoading: usersLoading, users } = useUserStore();

  useEffect(() => {
    const getSummaryCardsData = async () => {
      await Promise.all([fetchGenres(), fetchBooksNoFilters(), fetchUsers()]);
    };
    getSummaryCardsData();
  }, [fetchGenres, fetchBooksNoFilters, fetchUsers]);

  return (
    <>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12'>
        <div class='w-full p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700'>
          {usersLoading ? (
            <LoadingSpinnerSection />
          ) : (
            <>
              <Users className='mb-2' />
              <h5 class='mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white'>
                Total Users
              </h5>
              <p class='text-xl inline-flex font-bold items-center text-purple-600 hover:underline'>
                {users?.length || 0}
              </p>
            </>
          )}
        </div>
        <div class='w-full p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700'>
          {booksLoading ? (
            <LoadingSpinnerSection />
          ) : (
            <>
              <Book className='mb-2' />
              <h5 class='mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white'>
                Total Books
              </h5>
              <p class='text-xl inline-flex font-bold items-center text-purple-600 hover:underline'>
                {allBooks?.length || 0}
              </p>
            </>
          )}
        </div>
        <div class='w-full p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700'>
          {genresLoading ? (
            <LoadingSpinnerSection />
          ) : (
            <>
              <BookType className='mb-2' />
              <h5 class='mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white'>
                Total Genres
              </h5>
              <p class='text-xl inline-flex font-bold items-center text-purple-600 hover:underline'>
                {genres?.length || 0}
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminDashboardSummaryCards;
