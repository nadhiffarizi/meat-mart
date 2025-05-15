/** @format */

'use server';

import { signIn, signOut } from '@/auth';
import { redirect } from 'next/navigation';

export const login = async (credentials: { email: string; password: string }) =>
  await signIn('credentials', {
    ...credentials,
    redirect: false,
  }).catch((err) => (err instanceof Error ? { error: err.message } : err));

export const googleLogin = async () => {
  try {
    return await signIn('google', {
      redirect: true,
      callbackUrl: '/',
    });
  } catch (error) {
    console.error('Google login error:', error);
    throw error;
  }
};

export const logout = async () => {
  await signOut({ redirect: true, redirectTo: '/' });
};
