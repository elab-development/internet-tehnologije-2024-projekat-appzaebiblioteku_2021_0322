import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, Loader } from 'lucide-react';

import { useAuthStore } from '../../store/authStore';
import Input from '../../components/auth/Input';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, error, isLoading } = useAuthStore();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await login(email, password);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='min-h-screen bg-purple-950 flex items-center justify-center relative overflow-hidden'>
      <div className='max-w-lg w-full bg-gray-50 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden'>
        <div className='p-8'>
          <h2 className='text-3xl font-bold mb-6 text-center text-purple-950 bg-clip-text'>
            Welcome Back
          </h2>

          <form onSubmit={handleLogin}>
            <Input
              icon={Mail}
              type='email'
              placeholder='Email Address'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              icon={Lock}
              type='password'
              placeholder='Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className='flex items-center mb-6'>
              <Link
                to='/forgot-password'
                className='text-sm text-purple-400 hover:underline'
              >
                Forgot password?
              </Link>
            </div>

            {error && (
              <p className='text-red-500 font-semibold mb-2'>{error}</p>
            )}

            <button
              className='cursor-pointer w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold rounded-lg shadow-lg hover:from-purple-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200'
              type='submit'
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader className='w-6 h-6 animate-spin  mx-auto' />
              ) : (
                'Login'
              )}
            </button>
          </form>
        </div>
        <div className='px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center'>
          <p className='text-sm text-gray-400'>
            Don't have an account?{' '}
            <Link to='/register' className='text-purple-400 hover:underline'>
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
