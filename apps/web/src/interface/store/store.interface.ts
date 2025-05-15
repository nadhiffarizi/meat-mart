import { E_StoreStatus } from '@/models/auth.model';
import { User } from 'next-auth';

export default interface IStore {
  id: string;
  name: string;
  storeadmin_id?: string;
  status?: string;
  address?: string;
  province?: string;
  city?: string;
  district?: string;
  postal_code?: string;
}

export interface IGetStores {
  id: string;
  storeadmin_id: string;
  name: string;
  status: 'CENTRAL' | 'BRANCH';
  address: string;
  province: string;
  city: string;
  district: string;
  postal_code: string;
  latitude: string;
  longitude: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

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
  province_id: string;
  city_id: string;
  district_id: string;
}
