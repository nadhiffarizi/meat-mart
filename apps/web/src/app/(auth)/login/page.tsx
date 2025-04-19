/** @format */
'use client';
import { useFormik } from 'formik';
import Image from 'next/image';
import Link from 'next/link';
import React, { useRef } from 'react';
import Facebook from '@/../public/facebook.png';
import Google from '@/../public/google.png';
import { googleLogin, login } from '@/app/action/auth';
import { useRouter } from 'next/navigation';
import Snackbar from '@mui/material/Snackbar';
import { Alert, Button } from '@mui/material';

export default function Page() {
  const { push } = useRouter();
  const open = useRef(false);
  const [errMessage, setErrMessage] = React.useState('');
  const [isSocialLoading, setIsSocialLoading] = React.useState({
    google: false,
    facebook: false,
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    onSubmit: async (values) => {
      setErrMessage('');
      console.log('ini value ku, kalau kamu?', values);
      await login(values).then((res) => {
        if (res?.error) {
          setErrMessage(res.error);
        } else {
          open.current = true;
          push('/');
        }
      });
    },
  });

  return (
    <div className=" w-full max-w-[450px]">
      <div className="mb-4">
        <h4 className=" text-[21px] font-bold mb-1">Login</h4>
        <h5 className="mb-2">
          {"Don't have an account? "}
          <Link href={'/register'} className="green font-semibold">
            Sign up here
          </Link>
        </h5>
      </div>
      <form className="w-full" onSubmit={formik.handleSubmit}>
        <input
          type="email"
          required
          className="w-full p-4 mb-4 border rounded-md"
          placeholder="Email Address"
          name="email"
          value={formik.values.email}
          onChange={formik.handleChange}
        />

        <input
          type="password"
          className="w-full p-4 mb-4 border rounded-md"
          placeholder="Password"
          name="password"
          required
          value={formik.values.password}
          onChange={formik.handleChange}
        />
        <p className="text-red-600 mb-4 text-xs">{errMessage}</p>
        <button
          className={`${
            formik.isSubmitting
              ? 'bg-gray-300 text-gray-400'
              : 'bg-primaryGreen text-white'
          }  font-semibold p-4 w-full rounded-[50px] mb-6`}
          disabled={formik.isSubmitting}
        >
          {formik.isSubmitting ? 'Processing...' : 'Login'}
        </button>
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
          Login Success
        </Alert>
      </Snackbar>
      <center>
        <Link href={'#'} className="green font-bold ">
          Forgot password?
        </Link>
        <h5 className="mt-6 mb-2">Login instantly using your social media</h5>

        <div className="mb-6 space-y-3">
          <Button
            variant="outlined"
            fullWidth
            onClick={googleLogin}
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
      </center>
    </div>
  );
}
