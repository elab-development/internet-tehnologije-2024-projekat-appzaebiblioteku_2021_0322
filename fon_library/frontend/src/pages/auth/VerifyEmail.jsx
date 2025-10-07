import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

import { useAuthStore } from '../../store/authStore';

const VerifyEmail = () => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const { email } = useParams();
  const { verifyEmail, error, isLoading } = useAuthStore();
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  const handleChange = (index, value) => {
    const newCode = [...code];
    if (value.length > 1) {
      const pastedCode = value.slice(0, 6).split('');
      for (let i = 0; i < 6; i++) {
        newCode[i] = pastedCode[i] || '';
      }
      setCode(newCode);

      const lastFilledIndex = newCode.findLastIndex((digit) => digit !== '');
      const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
      inputRefs.current[focusIndex].focus();
    } else {
      newCode[index] = value;
      setCode(newCode);

      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const verificationCode = code.join('');

    try {
      await verifyEmail(email, verificationCode);
      navigate('/');
      toast.success('Email verified successfully');
    } catch (error) {
      toast.error(error.message);
      console.error(error);
    }
  };

  // Autosubmit
  useEffect(() => {
    if (code.every((digit) => digit !== '')) {
      handleSubmit(new Event('submit'));
    }
  }, [code]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className='min-h-screen bg-purple-950 flex items-center justify-center relative overflow-hidden'>
      <div className='max-w-lg w-full bg-gray-50 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden'>
        <div className='p-8'>
          <h2 className='text-3xl font-bold mb-6 text-center text-purple-950 bg-clip-text'>
            Verify Your Email
          </h2>

          {email ? (
            <>
              <p className='text-center text-gray-800 mb-6'>
                Enter the 6-digit code sent to your email address.
              </p>

              <form onSubmit={handleSubmit} className='space-y-6'>
                <div className='flex justify-between'>
                  {code.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type='text'
                      maxLength='6'
                      value={digit}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className='w-12 h-12 text-center text-2xl font-bold bg-gray-700 text-white border-2 border-gray-600 rounded-lg focus:border-purple-500 focus:outline-none'
                    />
                  ))}
                </div>

                {error && (
                  <p className='text-red-500 font-semibold mt-2'>{error}</p>
                )}

                <button
                  type='submit'
                  disabled={isLoading || code.some((digit) => !digit)}
                  className='w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:from-purple-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 disabled:opacity-50'
                >
                  {isLoading ? 'Verifying...' : 'Verify Email'}
                </button>
              </form>
            </>
          ) : (
            <div>
              <p className='text-red-500 font-semibold mt-2'>
                Your E-mail has not been provided, check your mail again.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
