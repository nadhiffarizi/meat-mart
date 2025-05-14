import { IUser } from '@/interface/user/user.interface';
import { E_Role } from '@prisma/client';

declare module 'next-auth' {
  interface User {
    id: string;
    first_name?: string | null;
    last_name?: string | null;
    email: string;
    image_url?: string | null;
    provider?: string;
    access_token?: string;
    refresh_token?: string;
    role?: E_Role;
    phone_number?: string | null;
    is_verified?: boolean;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      first_name?: string | null;
      last_name?: string | null;
      image_url?: string | null;
      provider?: string;
      access_token?: string;
      role?: E_Role;
      phone_number?: string | null;
      is_verified?: boolean;
    } & DefaultSession['user'];
  }
}

import { JWT } from 'next-auth/jwt';

declare module 'next-auth/jwt' {
  export interface JWT {
    id?: string;
    email?: string;
    access_token?: string;
    refresh_token?: string;
    provider?: string;
    role?: E_Role;
  }
}

declare global {
  export interface Window {
    snap: {
      pay: (
        token: string,
        config: {
          onSuccess: (res: { order_id: string }) => Promise<void>;
          onClose: () => void;
        },
      ) => void;
    };
  }
}

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}
