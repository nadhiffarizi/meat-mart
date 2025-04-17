'use client';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function VerificationSentPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  return (
    <div className="max-w-md mx-auto text-center p-4">
      <h1 className="text-2xl font-bold mb-4">Check Your Email</h1>
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <p className="font-mono break-all">{email}</p>
      </div>
      <p>We've sent a verification link to your email address.</p>

      <div className="mt-6 space-y-4">
        <p className="text-sm text-gray-600">
          Didn't receive the email?{' '}
          <button
            className="text-blue-500 underline"
            onClick={async () => {
              
              await fetch('/api/auth/resend-verification', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
              });
              alert('Verification email resent!');
            }}
          >
            Resend verification
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
