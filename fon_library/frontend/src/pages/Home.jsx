import { useAuthStore } from '../store/authStore';
import AdminDashboard from '../components/admin/AdminDashboard';
import Hero from '../components/home/Hero';
import GenresList from '../components/home/GenresList';
import TopBooksSection from '../components/home/TopBooksSection';

const Home = () => {
  const { isAuthenticated, user } = useAuthStore();

  return (
    <main className='p-0 m-0 bg-slate-50'>
      {isAuthenticated && user?.isAdmin ? (
        <AdminDashboard />
      ) : (
        <>
          <Hero />
          <GenresList />
          <TopBooksSection />
        </>
      )}
    </main>
  );
};

export default Home;
