/** @format */
'use server';
import { api } from './api';
import { cookies } from 'next/headers';
import { decode } from 'next-auth/jwt';
import { auth_secret } from '../config';

export const login = async (credentials: Partial<Record<string, unknown>>) => {
  console.log('Aku mencoba masuk ya gaess FRONT END nich');
  try {
    const res = await api('auth/login', 'POST', {
      body: credentials,
      contentType: 'application/json',
    });
    if (!res.data?.access_token || !res.data?.refresh_token) {
      throw new Error('Invalid login response');
    }
    console.log('INI RESnya', res);
    return {
      access_token: res.data.access_token,
      refresh_token: res.data.refresh_token,
    };
  } catch (error) {
    console.error('Login error:', error);
    throw new Error(
      error instanceof Error ? error.message : 'Authentication failed',
    );
  }
};

export const register = async (newUser: { email: string }) => {
  try {
    const data = await api('auth/register', 'POST', {
      body: newUser,
      contentType: 'application/json',
    });

    console.log('Registration success:', data);
    return data;
  } catch (error) {
    console.error('Registration error:', error);

    let errorMessage = 'Registration failed';
    if (error instanceof Error) {
      try {
        const errorData = JSON.parse(error.message);
        errorMessage = errorData.message || error.message;
      } catch {
        errorMessage = error.message;
      }
    }

    return { error: errorMessage };
  }
};

export const verifyEmail = async (token: string, password: string) => {
  try {
    const data = await api('auth/verify', 'POST', {
      body: { token, password },
      contentType: 'application/json',
    });
    console.log('Registration success:', data);
    return data;
  } catch (error) {
    console.error('Verification error:', error);
  }
};

export const resendVerificationEmail = async (email: string) => {
  try {
    console.log('MASUK HANDLERS RESEND VERIFICATION');
    const data = await api('auth/resend-verification', 'PATCH', {
      body: { email },
      contentType: 'application/json',
    });

    if (!data.success) {
      throw new Error(data.message || 'Failed to resend verification email');
    }

    return data;
  } catch (error) {
    console.error('Resend verification error', error);
    throw error;
  }
};

export const refreshToken = async () => {
  const cookie = cookies();
  const ftoken = cookie.get('next-auth.session-token')?.value;
  if (!ftoken) throw new Error('No session token found');
  const decoded = (await decode({
    token: ftoken,
    secret: auth_secret,
    salt: 'next-auth.session-token',
  })) as { refresh_token?: string };

  if (!decoded?.refresh_token) {
    throw new Error('No refresh token in session');
  }

  const res = await api('auth/token', 'POST', {}, decoded.refresh_token);

  if (!res.data?.access_token || !res.data?.refresh_token) {
    throw new Error('Invalid token response');
  }

  return {
    access_token: res.data.access_token,
    refresh_token: res.data.refresh_token,
  };
};

export const updateUser = async (
  data: {
    first_name: string;
    last_name: string;
  },
  token: string,
) => {
  await api(
    '/auth',
    'PATCH',
    {
      body: data,
      contentType: 'application/json',
    },
    token,
  );
};

export async function registerSocialUser(data: {
  email: string;
  name: string;
  image?: string;
  provider: string;
}) {
  // 1. Check if user exists in your database
  // 2. If not, create new user with social data
  // 3. Generate your JWT tokens (access_token and refresh_token)
  // 4. Return the user with tokens

  return {
    id: 'user-id-from-db',
    access_token: 'generated-jwt-token',
    refresh_token: 'generated-refresh-token',
  };
}
