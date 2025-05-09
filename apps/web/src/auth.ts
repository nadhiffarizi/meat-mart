/** @format */

import NextAuth, { User } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import {
  login,
  refreshToken,
  registerSocialUser,
} from './helpers/handlers/auth';
import Google from 'next-auth/providers/google';
import { jwtDecode } from 'jwt-decode';
import { InvalidAuthError } from './interfaces/auth.error';
import { E_Role } from '@prisma/client';

export interface ISocialUserData {
  email: string;
  fullName?: string;
  image?: string;
  provider: string;
  provider_id: string;
  role: string;
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: '/login',
  },
  cookies: {
    sessionToken: {
      name: 'next-auth.session-token',
      options: {
        domain: process.env.AUTH_DOMAIN as string,
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
      },
    },
  },
  secret: process.env.AUTH_SECRET as string,
  trustHost: true,
  session: {
    strategy: 'jwt',
    maxAge: 60 * 20,
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        console.log('Apakah aku di src/auth.ts', credentials);
        try {
          return await login(credentials);
        } catch (error: unknown) {
          throw new InvalidAuthError(error);
        }
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
          scope: 'openid email profile',
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === 'google') {
        try {
          // Register or get existing user from your database
          const userData: Partial<ISocialUserData> = {
            email: profile?.email as string,
            fullName: profile?.name as string,
            image: profile?.picture as string,
            provider: account.provider,
            provider_id: profile?.sub as string,
            role: 'SUPER_ADMIN' || 'ADMIN' || 'CUSTOMER',
          };

          const socialUser = await registerSocialUser({
            email: profile?.email as string,
            fullName: profile?.name as string,
            image: profile?.picture as string,
            provider: account.provider,
            provider_id: profile?.sub as string,
          });
          // Ensure the user object is properly returned
          if (!socialUser) {
            return false;
          }

          return true;
        } catch (error) {
          console.error('Google registration error:', error);
          return false;
        }
      }
      return true;
    },

    async jwt({ token, user }) {
      console.log('JWT callback - user role:', user?.role);
      if (user) {
        token.access_token = user.access_token;
        token.refresh_token = user.refresh_token;
        token.provider = user.provider;
        token.role = user.role;
      }
      return token;
    },

    async session({ session, token }) {
      console.log('Session callback - token role:', token.role);
      if (token.access_token) {
        const user = jwtDecode(token.access_token!) as User;
        // session.user.id = user.id as string;
        // session.user.email = user.email as string;
        // session.user.image_url = user.image_url as string;
        // session.user.first_name = user.first_name as string;
        // session.user.last_name = user.last_name as string;
        // session.user.role = user.role as string;
        // session.user.access_token = token.access_token as string;
        // session.user.is_verified = user.is_verified;
        session.user = {
          ...session.user,
          id: user.id as string,
          email: user.email as string,
          image_url: user.image_url as string,
          first_name: user.first_name as string,
          last_name: user.last_name as string,
          role: user.role as string,
          access_token: token.access_token as string,
          is_verified: user.is_verified,
          provider: token.provider as string,
        };
      }

      return session;
    },
  },
});

//access_token = untuk mengakses service di dalam api
//refresh_token = untuk mengupdate access_token yang baru
