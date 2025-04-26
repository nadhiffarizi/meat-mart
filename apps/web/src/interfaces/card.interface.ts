export interface ICard {
  id: number;
  name: string;
  price: number;
  stock: number;
}

export interface IProfile {
  id: string;
  image_url: string;
  first_name: string;
  last_name: string;
  email: string;
  emailUpdate: string;
  phone_number: string;
  is_verified: boolean | undefined;
  token: string;
  password: string;
  newPassword: string;
}
