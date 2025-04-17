'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { api } from '@/helpers/handlers/api';

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading',
  );
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('No verification token provided');
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await api('/auth/verify', 'POST', {
          body: { token },
        });

        const data = await response.json();

        if (data.success) {
          setStatus('success');
          setMessage(data.message);
        } else {
          throw new Error(data.message);
        }
      } catch (error) {
        setStatus('error');
        setMessage(
          error instanceof Error ? error.message : 'Verification failed',
        );
      }
    };

    verifyEmail();
  }, [token, router]);

  return (
    <div className="max-w-md mx-auto p-4 text-center">
      {status === 'loading' && (
        <div className="animate-pulse">
          <h1 className="text-2xl font-bold mb-4">Verifying your email...</h1>
          <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
        </div>
      )}

      {status === 'success' && (
        <div className="text-green-600">
          <h1 className="text-2xl font-bold mb-4">Success!</h1>
          <p>{message}</p>
          <button
            onClick={() => router.push('/login')}
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
          >
            Go to Login
          </button>
        </div>
      )}

      {status === 'error' && (
        <div className="text-red-600">
          <h1 className="text-2xl font-bold mb-4">Verification Failed</h1>
          <p>{message}</p>
          <button
            onClick={() => router.push('/register')}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}
