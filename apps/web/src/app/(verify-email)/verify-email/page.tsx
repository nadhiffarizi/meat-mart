'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { verifyEmail } from '@/helpers/handlers/auth';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { PasswordSchema } from '@/models/auth.model';

export default function SetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');
  const [serverError, setServerError] = useState<string | null>(null);
  useEffect(() => {
    if (status === 'success') {
      const timer = setTimeout(() => {
        router.push('/login?verified=1');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [status, router]);

  // if (!token) {
  //   return (
  //     <div className="max-w-md mx-auto p-4 text-center">
  //       <h1 className="text-2xl font-bold mb-4">Invalid Verification Link</h1>
  //       <p>The verification link is missing or invalid.</p>
  //       <Link
  //         href="/"
  //         className="text-blue-500 hover:underline mt-4 inline-block"
  //       >
  //         Return to Home
  //       </Link>
  //     </div>
  //   );
  // }

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Set Your Password</h1>

      <Formik
        initialValues={{
          password: '',
          confirmPassword: '',
          token: `${token}`,
        }}
        validationSchema={PasswordSchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            setStatus('loading');
            setServerError(null);

            const result = await verifyEmail(
              values.token,
              values.confirmPassword,
            );

            if (result.success) {
              setStatus('success');
              console.log(status);
              setServerError(result.message || 'Verification success');
            } else {
              setStatus('error');
              setServerError(result.message || 'Verification failed');
            }
          } catch (error) {
            setStatus('error');
            setServerError('An error occurred. Please try again.');
            console.error('Verification error:', error);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form className="space-y-4">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-1"
              >
                Your Password
              </label>
              <Field
                name="password"
                type="password"
                className={`w-full p-2 border rounded-md ${
                  errors.password && touched.password
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
                placeholder="At least 8 characters"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium mb-1"
              >
                Confirm Password
              </label>
              <Field
                name="confirmPassword"
                type="password"
                className={`w-full p-2 border rounded-md ${
                  errors.confirmPassword && touched.confirmPassword
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
                placeholder="Re-enter your password"
              />
              <ErrorMessage
                name="confirmPassword"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {serverError && (
              <>
                <div className="p-2 bg-green-50 text-green-600 rounded-md text-sm">
                  {serverError}
                </div>
                <span>
                  {' '}
                  <Link href="/login" className="text-sm hover:underline">
                    login here
                  </Link>
                </span>
              </>
            )}

            <button
              type="submit"
              disabled={isSubmitting || status === 'loading'}
              className={`w-full py-2 px-4 bg-primaryGreen text-white rounded-md hover:bg-orangeAccent transition-colors ${
                isSubmitting || status === 'loading'
                  ? 'opacity-70 cursor-not-allowed'
                  : ''
              }`}
            >
              {isSubmitting || status === 'loading'
                ? 'Processing...'
                : 'Set Password and Verify Email'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
