import { useEffect } from 'react';

import BookCoverPlaceholder from '../../../assets/cover_not_found.jpg';
import AmazonLogo from '../../../assets/buyfrom/amazon.webp';
import AppleBooksLogo from '../../../assets/buyfrom/apple.png';
import bamLogo from '../../../assets/buyfrom/bam.png';
import BookShopOrgLogo from '../../../assets/buyfrom/bookshop.png';
import { useReportStore } from '../../../store/reportStore';
import LoadingSpinnerSection from '../../loading/LoadingSpinnerSection';

const SuggestedBooks = () => {
  const { newYorkTimesTopBooks, fetchNewYorkTimesTopBooks, isLoading, error } =
    useReportStore();

  useEffect(() => {
    fetchNewYorkTimesTopBooks();
  }, [fetchNewYorkTimesTopBooks]);

  return (
    <>
      {isLoading ? (
        <LoadingSpinnerSection />
      ) : error || newYorkTimesTopBooks.length === 0 ? (
        <div className='text-red-500 text-center'>
          {error || 'No suggested books available at the moment.'}
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
          {newYorkTimesTopBooks.map((book, index) => (
            <div
              key={index}
              className='cursor-pointer bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-4 flex flex-col items-center text-center hover:scale-105 transform'
            >
              <img
                src={book.book_image || BookCoverPlaceholder}
                alt={book.title}
                className='h-32 object-cover mb-4 rounded'
              />
              <h3 className='line-clamp-1 text-lg font-semibold text-purple-700 dark:text-purple-400 mb-1'>
                {book.title}
              </h3>
              <p className='text-sm text-gray-600 dark:text-gray-300 mb-1'>
                by {book.author}
              </p>
              {book.buy_links && book.buy_links.length > 0 && (
                <div className='flex space-x-2 mt-2'>
                  {book.buy_links.map((link) => {
                    let logo;
                    switch (link.name) {
                      case 'Amazon':
                        logo = AmazonLogo;
                        break;
                      case 'Apple Books':
                        logo = AppleBooksLogo;
                        break;
                      case 'Books-A-Million':
                        logo = bamLogo;
                        break;
                      case 'Bookshop.org':
                        logo = BookShopOrgLogo;
                        break;
                      default:
                        logo = null;
                    }
                    return (
                      <>
                        {logo !== null && (
                          <a
                            key={link.url}
                            href={link.url}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='flex items-center space-x-1'
                          >
                            {logo && (
                              <img src={logo} alt={link.name} className='h-6' />
                            )}
                          </a>
                        )}
                      </>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default SuggestedBooks;
