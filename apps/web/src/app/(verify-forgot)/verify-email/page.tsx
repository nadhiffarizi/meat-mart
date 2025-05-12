'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { verifyEmail } from '@/helper/handlers/auth';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { PasswordSchema } from '@/models/auth.model';

export default function SetPasswordPage() {
  const { push } = useRouter();
  const open = useRef(false);
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!token) {
    return (
      <div className="max-w-md mx-auto p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Invalid Verification Link</h1>
        <p>The verification link is missing or invalid.</p>
        <Link
          href="/"
          className="text-blue-500 hover:underline mt-4 inline-block"
        >
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[450px]">
      <h1 className="text-[21px] font-bold mb-1">Set Your Password</h1>

      <Formik
        initialValues={{
          password: '',
          confirmPassword: '',
          token: `${token}`,
        }}
        validationSchema={PasswordSchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            setIsSending(true);
            setError(null);
            setSuccess(false);
            if (values.password === values.confirmPassword) {
              await verifyEmail(values.token, values.password);

              setSuccess(true);

              setTimeout(() => setSuccess(false), 5000);
              open.current = true;
              push('/login');
            } else {
              throw new Error(
                'Your Password and confirm Password did not match',
              );
            }
          } catch (error) {
            console.error('Resend error:', error);
            setError(
              error instanceof Error
                ? error.message
                : 'Verification error. Please try again.',
            );
          } finally {
            setSubmitting(false);
            setIsSending(false);
          }
        }}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form className="w-full">
            <div className="mb-4">
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
                  className={`w-full p-4 mb-1 border rounded-md ${
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
                  className={`w-full p-4 mb-1 border rounded-md ${
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
            </div>
            {/* 
            {success && (
              <div className="p-2 bg-green-50 text-green-600 rounded-md text-sm mb-2">
                {'Email succesfully verified'}
              </div>
            )} */}
            {error ? (
              <div className="p-2 bg-red-50 text-red-600 rounded-md text-sm mb-2">
                {'Invalid token'}
              </div>
            ) : (
              ''
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className={`font-semibold p-4 w-full rounded-[50px] mb-6 bg-primaryGreen text-white hover:bg-orangeAccent transition-colors ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting
                ? 'Processing...'
                : success
                  ? 'Verified!'
                  : 'Set Password and Verify Email'}
            </button>

            {success && (
              <div className="text-center">
                <p>
                  Not redirected?{' '}
                  <Link
                    href="/login?verified=1"
                    className="text-blue-500 hover:underline"
                  >
                    Click here to login
                  </Link>
                </p>
              </div>
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
}
