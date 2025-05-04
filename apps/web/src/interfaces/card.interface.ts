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
  provider: string;
}

export interface Address {
  id: string;
  user_id: string;
  recipient_name: string;
  recipient_phone_number: string;
  is_selected: boolean;
  address: string;
  province: string;
  province_id: string;
  city: string;
  city_id: string;
  district: string;
  district_id: string;
  postal_code: string;
  latitude: string;
  longitude: string;
}

export interface IAddress {
  id: string;
  user_id: string;
  recipient_name: string;
  recipient_phone_number: string;
  is_selected: boolean;
  address: string;
  province: string;
  //province_id: string;
  city: string;
  //city_id: string;
  district: string;
  //district_id: string;
  postal_code: string;
  latitude: string;
  longitude: string;
}

export interface Province {
  code: string;
  name: string;
}

export interface City {
  code: string;
  province_id: string;
  type: string;
  name: string;
  postal_code: string;
}

export interface District {
  code: string;
  id_kota: string;
  name: string;
}
