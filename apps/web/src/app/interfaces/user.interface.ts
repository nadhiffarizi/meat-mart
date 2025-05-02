export interface IGetUsers {
  id: string;
  first_name: string;
  last_name?: string;
  email: string;
  password?: string;
  image_url?: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'CUSTOMER';
  phone_number?: string;
  is_verified: boolean;
  verification_link?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}
