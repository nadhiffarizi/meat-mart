export interface ICard {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  popularity: number;
  isNew: boolean;
  isSpecial: boolean;
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
