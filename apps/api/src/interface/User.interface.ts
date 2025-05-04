import { E_Role } from '@prisma/client';

export interface IUser {
  id: string;
  first_name?: string | null;
  last_name?: string | null;
  email: string;
  password?: string | null;
  image_url?: string | null;
  role: E_Role;
  phone_number?: string | null;
  is_verified: boolean;
  verification_link?: string | null;
  verification_expiry?: Date | null;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date | null;
  provider?: string | null;
  provider_id?: string | null;
}

export interface ISocialUserData {
  email: string;
  name?: string;
  image?: string;
  provider: string;
  provider_id?: string;
}

export interface Address {
  id: string;
  user_id: string;
  recipient_name: string;
  recipient_phone_number: string;
  is_selected: boolean;
  address: string;
  province: string;
  city: string;
  district: string;
  postal_code: string;
  latitude: string;
  longitude: string;
}
