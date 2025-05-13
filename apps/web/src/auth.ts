/** @format */

import NextAuth, { User } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { login, refreshToken, registerSocialUser } from './helper/auth/auth';
import Google from 'next-auth/providers/google';
import { jwtDecode } from 'jwt-decode';
import { InvalidAuthError } from './interface/user/auth.error';

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
      if (account?.provider == 'google') {
        return profile?.email_verified || false;
      }
      try {
        // Register or get existing user from your database
        const socialUser = await registerSocialUser({
          email: profile?.email!,
          name: profile?.name!,
          image: profile?.picture,
          provider: 'google',
        });

        // Merge social user data with the user object
        // user.id = socialUser.id;
        // user.access_token = socialUser.access_token;
        // user.refresh_token = socialUser.refresh_token;

        // return true;
      } catch (error) {
        console.error('Google registration error:', error);
        return false;
      }
      return true;
    },
    async jwt({ token, user, trigger }) {
      if (user) {
        const { access_token, refresh_token } = user;
        return { access_token, refresh_token };
      } else if (token.access_token || trigger == 'update') {
        const newToken = await refreshToken();
        return newToken;
      }
      return token;
    },

    async session({ session, token }) {
      if (token.access_token) {
        const user = jwtDecode(token.access_token!) as User;
        session.user.id = user.id as string;
        session.user.email = user.email as string;
        session.user.img_src = user.img_src as string;
        session.user.first_name = user.first_name as string;
        session.user.last_name = user.last_name as string;
        session.user.role = user.role as string;
        session.user.access_token = token.access_token as string;
      }

      return session;
    },
  },
});

//access_token = untuk mengakses service di dalam api
//refresh_token = untuk mengupdate access_token yang baru
