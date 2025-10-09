import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import BookGenrePlaceholder from '../../assets/book_genre_placeholder.png';
import { useGenreStore } from '../../store/genreStore';
import LoadingSpinnerSection from '../loading/LoadingSpinnerSection';

const GenresList = () => {
  const { genres, fetchGenres, isLoading, error } = useGenreStore();
  const navigate = useNavigate();

  useEffect(() => {
    const getGenres = async () => {
      await fetchGenres();
    };
    getGenres();
  }, [fetchGenres]);

  const handleClick = (genreName) => {
    navigate(`/books?genre=${encodeURIComponent(genreName)}`);
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
              Explore by Genre
            </h2>
            <p className='mt-2 text-gray-600 dark:text-gray-300 max-w-xl mx-auto text-sm sm:text-base'>
              Find books that match your favorite genres. Discover thrilling
              novels, inspiring biographies, and more.
            </p>
          </div>

          {/* Grid Section */}
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
            {genres.map((genre) => (
              <div
                key={genre._id}
                onClick={() => handleClick(genre.name)}
                className='cursor-pointer bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-4 flex flex-col items-center text-center hover:scale-105 transform'
              >
                <img
                  src={BookGenrePlaceholder}
                  alt='Purple Book'
                  className='h-24 object-cover mb-4'
                />
                <h3 className='text-lg font-semibold text-purple-700 dark:text-purple-400 mb-2'>
                  {genre.name}
                </h3>
                <p className='text-sm text-gray-600 dark:text-gray-300'>
                  {genre.description || 'No description available.'}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
};

export default GenresList;
