import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader, Lock, Mail, User } from 'lucide-react';

import { useAuthStore } from '../../store/authStore';
import Input from '../../components/auth/Input';
import PasswordStrengthMeter from '../../components/auth/PasswordStrengthMeter';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { register, error, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await register(email, password, name);
      navigate(`/verify-email/${email}`);
    } catch (error) {}
  };

  return (
    <div className='min-h-screen bg-purple-950 flex items-center justify-center relative overflow-hidden'>
      <div className='max-w-lg w-full bg-gray-50 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden'>
        <div className='p-8'>
          <h2 className='text-3xl font-bold mb-6 text-center text-purple-950 bg-clip-text'>
            Create Account
          </h2>

          <form onSubmit={handleRegister}>
            <Input
              icon={User}
              type='text'
              placeholder='Full Name'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
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

            {error && (
              <p className='text-red-500 font-semibold mt-2'>{error}</p>
            )}
            {password && <PasswordStrengthMeter password={password} />}

            <button
              className='cursor-pointer mt-5 w-full py-3 px-4 bg-purple-500 text-white 
						font-bold rounded-lg shadow-lg hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
						 focus:ring-offset-gray-900 transition duration-200'
              type='submit'
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader className=' animate-spin mx-auto' size={24} />
              ) : (
                'Sign Up'
              )}
            </button>
          </form>
        </div>
        <div className='px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center'>
          <p className='text-sm text-gray-400'>
            Already have an Account?{' '}
            <Link to={'/login'} className='text-purple-400 hover:underline'>
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
