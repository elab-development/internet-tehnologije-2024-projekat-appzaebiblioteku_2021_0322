import { useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

import { useReportStore } from '../../../store/reportStore';
import LoadingSpinnerSection from '../../loading/LoadingSpinnerSection';

const DashboardOverview = () => {
  const {
    topBooks,
    topGenres,
    topUsers,
    fetchTopBooks,
    fetchTopGenres,
    fetchTopUsers,
    isLoading,
  } = useReportStore();

  useEffect(() => {
    fetchTopBooks();
    fetchTopGenres();
    fetchTopUsers();
  }, []);

  if (isLoading) return <LoadingSpinnerSection />;

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-12'>
      <h2 className='text-2xl font-bold text-gray-800 dark:text-white'>
        Dashboard Overview
      </h2>

      {/* Top Borrowed Books */}
      <div>
        <h3 className='text-xl font-semibold mb-4 text-purple-600 dark:text-purple-400'>
          Top 5 Borrowed Books
        </h3>
        <ResponsiveContainer width='100%' height={300}>
          <BarChart data={topBooks}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='title' />
            <YAxis />
            <Tooltip />
            <Bar dataKey='borrowCount' fill='#8b5cf6' />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top Genres */}
      <div>
        <h3 className='text-xl font-semibold mb-4 text-purple-600 dark:text-purple-400'>
          Top 5 Genres by Borrows
        </h3>
        <ResponsiveContainer width='100%' height={300}>
          <BarChart data={topGenres}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='name' />
            <YAxis />
            <Tooltip />
            <Bar dataKey='borrowCount' fill='#ec4899' />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top Users */}
      <div>
        <h3 className='text-xl font-semibold mb-4 text-purple-600 dark:text-purple-400'>
          Top 3 Users by Borrows
        </h3>
        <ResponsiveContainer width='100%' height={300}>
          <BarChart data={topUsers}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='name' />
            <YAxis />
            <Tooltip />
            <Bar dataKey='borrowCount' fill='#10b981' />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardOverview;
