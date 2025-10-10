import { useState } from 'react';

import AdminDashboardSummaryCards from './AdminDashboardSummaryCards';
import DashboardOverview from './tabs/DashboardOverview';
import GenreManager from './tabs/GenreManager';
import UsersManager from './tabs/UsersManager';
import BooksManager from './tabs/BooksManager';
import BorrowsManager from './tabs/BorrowsManager';
import SuggestedBooks from './tabs/SuggestedBooks';

const tabs = [
  { label: 'Dashboard', value: 'dashboard' },
  { label: 'Users', value: 'users' },
  { label: 'Books', value: 'books' },
  { label: 'Genres', value: 'genres' },
  { label: 'Borrows', value: 'borrows' },
  { label: 'Suggested', value: 'suggested' },
];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'users':
        return <UsersManager />;
      case 'books':
        return <BooksManager />;
      case 'genres':
        return <GenreManager />;
      case 'borrows':
        return <BorrowsManager />;
      case 'suggested':
        return <SuggestedBooks />;
      default:
        return null;
    }
  };

  return (
    <div className='p-8 max-w-7xl mx-auto'>
      <h1 className='text-3xl font-bold my-6'>Admin Dashboard</h1>
      <AdminDashboardSummaryCards />
      {/* Mobile Select Tabs */}
      <div className='sm:hidden mb-4'>
        <label htmlFor='tabs' className='sr-only'>
          Select section
        </label>
        <select
          id='tabs'
          value={activeTab}
          onChange={(e) => setActiveTab(e.target.value)}
          className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white'
        >
          {tabs.map((tab) => (
            <option key={tab.value} value={tab.value}>
              {tab.label}
            </option>
          ))}
        </select>
      </div>

      {/* Desktop Tabs */}
      <ul className='hidden text-sm font-medium text-center text-gray-500 rounded-lg shadow-sm sm:flex dark:divide-gray-700 dark:text-gray-400 mb-6'>
        {tabs.map((tab, index) => (
          <li key={tab.value} className='w-full focus-within:z-10'>
            <button
              onClick={() => setActiveTab(tab.value)}
              className={`cursor-pointer inline-block w-full p-4 border-r border-gray-200 dark:border-gray-700 focus:ring-4 focus:ring-purple-300 focus:outline-none
                ${
                  activeTab === tab.value
                    ? 'text-gray-900 bg-gray-100 dark:bg-gray-700 dark:text-white'
                    : 'bg-white dark:bg-gray-800 hover:text-gray-700 hover:bg-gray-50 dark:hover:text-white dark:hover:bg-gray-700'
                }
                ${index === 0 ? 'rounded-s-lg' : ''}
                ${index === tabs.length - 1 ? 'rounded-e-lg border-r-0' : ''}
              `}
            >
              {tab.label}
            </button>
          </li>
        ))}
      </ul>
      <div>{renderTabContent()}</div>
    </div>
  );
};

export default AdminDashboard;
