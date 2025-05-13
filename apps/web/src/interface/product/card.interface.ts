export interface ICard {
  id: string;
  name: string;
  price: number;
  stock: number;
}

export interface IProfile {
  id: number;
  first_name: string;
  last_name: string;
  password: string;
  email: string;
  phone_number: string;
  is_verified: boolean;
}
