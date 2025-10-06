import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { useAuthStore } from './store/authStore';
import LoadingSpinner from './components/loading/LoadingSpinner';
import Layout from './components/Layout';
import RedirectAuthUser from './components/auth/RedirectAuthUser';
import ProtectRoute from './components/auth/ProtectRoute';
import Home from './pages/Home';
import Books from './pages/Books';
import BookDetails from './pages/BookDetails';
import Borrows from './pages/Borrows';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import VerifyEmail from './pages/auth/VerifyEmail';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

function App() {
  const { isCheckingAuth, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) {
    return <LoadingSpinner />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path='/'
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route
          path='/books'
          element={
            <Layout>
              <Books />
            </Layout>
          }
        />
        <Route
          path='/books/:id'
          element={
            <Layout>
              <BookDetails />
            </Layout>
          }
        />

        {/* PROTECTED ROUTES START */}
        <Route
          path='/borrows'
          element={
            <ProtectRoute>
              <Layout>
                <Borrows />
              </Layout>
            </ProtectRoute>
          }
        />
        {/* PROTECTED ROUTES END */}

        {/* AUTH ROUTES START */}
        <Route
          path='/login'
          element={
            <RedirectAuthUser>
              <Login />
            </RedirectAuthUser>
          }
        />
        <Route
          path='/register'
          element={
            <RedirectAuthUser>
              <Register />
            </RedirectAuthUser>
          }
        />
        <Route
          path='/verify-email/:email'
          element={
            <RedirectAuthUser>
              <VerifyEmail />
            </RedirectAuthUser>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <RedirectAuthUser>
              <ForgotPassword />
            </RedirectAuthUser>
          }
        />
        <Route
          path='/reset-password/:token/:email'
          element={
            <RedirectAuthUser>
              <ResetPassword />
            </RedirectAuthUser>
          }
        />
        {/* AUTH ROUTES END */}
      </Routes>

      <Toaster position='top-center' reverseOrder={false} />
    </BrowserRouter>
  );
}

export default App;
