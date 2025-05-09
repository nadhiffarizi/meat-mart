import { E_StoreStatus } from '@prisma/client';
import { User } from 'next-auth';

export interface StoreWithAdmin {
  id: string;
  storeadmin_id: string;
  storeadmin: Pick<User, 'id' | 'email' | 'first_name' | 'last_name'>;
  name: string;
  status: E_StoreStatus;
  address: string;
  province: string;
  city: string;
  district: string;
  postal_code: string;
  latitude: string;
  longitude: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}
