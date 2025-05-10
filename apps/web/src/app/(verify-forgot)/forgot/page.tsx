'use client';
import { resendVerificationEmail, resetEmail } from '@/helper/auth/auth';
import { useFormik } from 'formik';
import React, { useState } from 'react';

type Props = {};

export default function page({}: Props) {
  const [success, setSuccess] = useState<boolean>(false);

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    onSubmit: async (values) => {
      if (!values.email) return;
      try {
        const result = await resetEmail(values.email);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 5000);
        // if (result.success) {
        //   setSuccess(true);
        //   setTimeout(() => setSuccess(false), 5000);
        // } else {
        //   throw new Error(result.message || 'Failed to reset email');
        // }
      } catch (error) {
        console.log(error);
      }
    },
  });
  return (
    <div className="w-full max-w-[450px]">
      <div className="mb-4">
        <h4 className="text-[21px] font-bold mb-1">Forgot Password</h4>
        <form className="w-full" onSubmit={formik.handleSubmit}>
          <input
            type="email"
            required
            className="w-full p-4 mb-1 border rounded-md"
            placeholder="Enter your email address"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
          />

          <p className="mb-4 text-red-400 text-sm">{formik.errors.email}</p>

          {success && (
            <div className="mt-4 mb-2 p-2 bg-green-100 text-green-700 rounded">
              We've sent you a reset email
            </div>
          )}
          <button
            type="submit"
            className={`${
              !formik.isValid || formik.isSubmitting
                ? 'bg-gray-300 text-gray-400'
                : 'bg-primaryGreen text-white'
            } font-semibold p-4 w-full rounded-[50px] mb-6`}
            disabled={!formik.isValid || formik.isSubmitting}
          >
            {formik.isSubmitting ? 'Processing...' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  );
}
