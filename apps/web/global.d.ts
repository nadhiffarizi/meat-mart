/** @format */

declare module 'next-auth' {
  interface User {
    id?: string | undefined;
    first_name?: string | null | undefined;
    last_name?: string | null | undefined;
    email: string | null | undefined;
    image_url?: string | null | undefined;
    provider?: string | null | undefined;
    access_token?: string | undefined;
    refresh_token?: string | undefined;
    role?: string | undefined;
    phone_number?: string | undefined;
    is_verified?: boolean | undefined;
  }

  interface Session {
    user: User;
  }
}

import { JWT } from 'next-auth/jwt';

declare module 'next-auth/jwt' {
  export interface JWT {
    access_token?: string | undefined;
    refresh_token?: string | undefined;
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
