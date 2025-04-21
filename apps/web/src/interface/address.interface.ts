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