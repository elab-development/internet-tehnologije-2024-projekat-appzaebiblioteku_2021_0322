import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Lock } from 'lucide-react';
import toast from 'react-hot-toast';

import { useAuthStore } from '../../store/authStore';
import Input from '../../components/auth/Input';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { resetPassword, error, isLoading } = useAuthStore();

  const { token, email } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      await resetPassword(token, email, password);

      toast.success(
        'Password reset successfully, redirecting to login page...'
      );

      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Error resetting password');
    }
  };

  return (
    <div className='min-h-screen bg-purple-950 flex items-center justify-center relative overflow-hidden'>
      <div className='max-w-lg w-full bg-gray-50 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden'>
        <div className='p-8'>
          <h2 className='text-3xl font-bold mb-6 text-center text-purple-950 bg-clip-text'>
            Reset Password
          </h2>
          {error && <p className='text-red-500 text-sm mb-4'>{error}</p>}

          <form onSubmit={handleSubmit}>
            <Input
              icon={Lock}
              type='password'
              placeholder='New Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Input
              icon={Lock}
              type='password'
              placeholder='Confirm New Password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <button
              className='w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold rounded-lg shadow-lg hover:from-purple-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200'
              type='submit'
              disabled={isLoading}
            >
              {isLoading ? 'Resetting...' : 'Set New Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
