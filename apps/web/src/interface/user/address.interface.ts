export default interface IAddress {
  id?: string,
  user_id?: string,
  recipient_name?: string,
  recipient_phone_number?: string,
  address: string,
  province?: string,
  city?: string,
  district?: string,
  postal_code?: string,
  latitude: string,
  longitude: string,
  created_at?: string,
  updated_at?: string,
  deleted_at?: string,
  is_selected?: boolean
}
id ?: string;
user_id ?: string;
recipient_name ?: string;
recipient_phone_number ?: string;
address: string;
province ?: string;
city ?: string;
district ?: string;
postal_code ?: string;
latitude: string;
longitude: string;
created_at ?: string;
updated_at ?: string;
deleted_at ?: string;
is_selected ?: boolean;
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
