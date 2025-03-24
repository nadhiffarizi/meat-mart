export default interface IProduct {
    id: string
    name: string
    slug: string
    price: number
    weight: number
    created_at: string
    updated_at: string
    deleted_at: string | Object
}