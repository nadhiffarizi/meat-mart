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