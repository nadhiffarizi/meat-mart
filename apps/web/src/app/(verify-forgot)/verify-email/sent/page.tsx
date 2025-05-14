'use client';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { resendVerificationEmail } from '@/helper/auth/auth';
import { useState } from 'react';

export default function VerificationSentPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleResend = async () => {
    if (!email) return;

    try {
      setIsSending(true);
      setError(null);
      setSuccess(false);

      const result = await resendVerificationEmail(email);
      if ('error' in result) {
        setError(result.error);
        return;
      } else {
        setSuccess(true);

        setTimeout(() => setSuccess(false), 5000);
      }
    } catch (error) {
      console.error('Resend error:', error);
      setError(
        error instanceof Error
          ? error.message
          : 'Failed to resend verification email. Please try again.',
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="max-w-md mx-auto text-center p-4">
      <h1 className="text-2xl font-bold mb-4">Check Your Email</h1>
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <p className="">{email}</p>
      </div>
      <p>We have ve sent a verification link to your email address.</p>

      {success && (
        <div className="mt-4 p-2 bg-green-100 text-green-700 rounded">
          Verification email resent successfully!
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="mt-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      <div className="mt-6 space-y-4">
        <p className="text-sm text-gray-600">
          Did not receive the email?{' '}
          <button
            className={`text-blue-500 underline ${isSending ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleResend}
            disabled={isSending}
          >
            {isSending ? 'Sending...' : 'Resend verification'}
          </button>
        </p>
        <Link
          href="/login"
          className="inline-block text-blue-500 hover:text-blue-700"
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
}
