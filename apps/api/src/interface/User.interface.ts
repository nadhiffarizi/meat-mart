import { E_Role } from '@prisma/client';

export interface IUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: E_Role;
  password?: string;
  image_url?: string;
  is_verified: boolean;
}
