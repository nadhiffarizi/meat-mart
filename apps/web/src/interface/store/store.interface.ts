import { string } from "yup"

export default interface IStore {
    id: string,
    name: string,
    storeadmin_id?: string,
    status?: string,
    address?: string,
    province?: string,
    city?: string,
    district?: string,
    postal_code?: string,
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
