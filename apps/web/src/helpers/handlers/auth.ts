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

    // Handle different error cases
    let errorMessage = 'Registration failed';
    if (error instanceof Error) {
      try {
        // Try to parse error message as JSON
        const errorData = JSON.parse(error.message);
        errorMessage = errorData.message || error.message;
      } catch {
        // Not JSON, use raw message
        errorMessage = error.message;
      }
    }

    return { error: errorMessage };
  }
};

// export const register = async (newUser: {
//   email: string;
//   //  password: string
// }) =>
//   //   {
//   //   try {
//   //     const res = await api('auth/register', 'POST', {
//   //       body: newUser,
//   //       contentType: 'application/json',
//   //     });
//   //     console.log('INI RESnya', res);
//   //   } catch (error) {
//   //     console.log('register error', error);
//   //   }
//   // };
//   {
//     try {
//       const response = await api('auth/register', 'POST', {
//         body: newUser,
//         contentType: 'application/json',
//       });

//       console.log('Raw response:', response);

//       try {
//         //const res= response.data;
//         const data = await response.json();
//         console.log('INIDATA', data);
//         return data;
//       } catch (jsonError) {
//         console.error('JSON parse error:', jsonError);
//         return { error: 'Invalid server response' };
//       }
//     } catch (error) {
//       console.error('Network error:', error);
//       return {
//         error: error instanceof Error ? error.message : 'Network error',
//       };
//     }
//   };

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
