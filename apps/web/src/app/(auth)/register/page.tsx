/** @format */
'use client';
import { register } from '@/helper/auth/auth';
import { registerInit } from '@/helper/formik.init';
import { registerValidator } from '@/models/auth.model';
import { Alert, Snackbar, Divider, Button } from '@mui/material';
import { useFormik } from 'formik';
import Link from 'next/link';
import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, SignInResponse } from 'next-auth/react';
import Image from 'next/image';
import { googleLogin } from '@/app/action/auth';

export default function Page() {
  const router = useRouter();
  const [errMessage, setErrMessage] = React.useState('');
  const [isSocialLoading, setIsSocialLoading] = React.useState({
    google: false,
    facebook: false,
  });
  const open = useRef(false);

  const formik = useFormik({
    validationSchema: registerValidator,
    initialValues: registerInit,
    onSubmit: async (values) => {
      setErrMessage('');
      try {
        const result = await register(values);
        console.log('Registration result:', result);

        if ('error' in result) {
          setErrMessage(result.error);
        } else {
          // Successful registration
          router.push(
            `/verify-email/sent?email=${encodeURIComponent(values.email)}`,
          );
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        setErrMessage('An unexpected error occurred');
      }
    },
  });

  const handleGoogleLogin = async () => {
    try {
      setIsSocialLoading((prev) => ({ ...prev, google: true }));
      setErrMessage('');
      await signIn('google', {
        redirect: true,
        callbackUrl: '/',
      });

      // const result = await signIn('google', {
      //   redirect: true,
      //   callbackUrl: '/',
      // });

      // const error = (result as SignInResponse).error;
      // const url = (result as SignInResponse).url;

      // if (error) {
      //   setErrMessage(error);
      // } else if (url) {
      //   router.push(url);
      // }
    } catch (error) {
      console.error('Google login error:', error);
      setErrMessage('Failed to login with Google');
    } finally {
      setIsSocialLoading((prev) => ({ ...prev, google: false }));
    }
  };

  return (
    <div className="w-full max-w-[450px]">
      <div className="mb-4">
        <h4 className="text-[21px] font-bold mb-1">Register</h4>
        <h5 className="mb-2">
          {'Already have an account? '}
          <Link href={'/login'} className="green font-semibold">
            Sign in here
          </Link>
        </h5>
      </div>

      {/* Social Login Buttons */}
      <div className="mb-6 space-y-3">
        <Button
          variant="outlined"
          fullWidth
          onClick={handleGoogleLogin}
          disabled={isSocialLoading.google}
          startIcon={
            <Image src="/google.png" alt="Google" width={20} height={20} />
          }
          sx={{
            py: 1.5,
            textTransform: 'none',
            fontSize: '0.875rem',
            borderColor: '#ddd',
            color: '#444',
            '&:hover': {
              borderColor: '#ccc',
              backgroundColor: 'rgba(0,0,0,0.02)',
            },
          }}
        >
          {isSocialLoading.google ? 'Processing...' : 'Continue with Google'}
        </Button>
      </div>

      <Divider className="my-4">OR</Divider>

      <form className="w-full" onSubmit={formik.handleSubmit}>
        <input
          type="email"
          required
          className="w-full p-4 mb-1 border rounded-md"
          placeholder="Email Address"
          name="email"
          value={formik.values.email}
          onChange={formik.handleChange}
        />

        <p className="mb-4 text-red-400 text-sm">{formik.errors.email}</p>

        <p className="text-xs mb-4">
          {"By registering, I agree to MeatMart's "}
          <span className="green">Terms and Conditions</span>
          {' and '}
          <span className="green">Privacy Policy</span>
        </p>
        <p className="mb-4 text-red-400 text-sm">{errMessage}</p>

        <button
          type="submit"
          className={`${
            !formik.isValid || formik.isSubmitting
              ? 'bg-gray-300 text-gray-400'
              : 'bg-primaryGreen text-white'
          } font-semibold p-4 w-full rounded-[50px] mb-6`}
          disabled={!formik.isValid || formik.isSubmitting}
        >
          {formik.isSubmitting ? 'Processing...' : 'Register with email'}
        </button>
        <center className="text-sm">
          {'Your data will be protected and will not be shared'}
        </center>
      </form>
      <Snackbar
        open={open.current}
        autoHideDuration={1500}
        onClose={() => {
          open.current = false;
        }}
        message="Login Success"
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" variant="filled" sx={{ width: '100%' }}>
          verify your email
        </Alert>
      </Snackbar>
    </div>
  );
}
