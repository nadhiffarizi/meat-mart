import IStock from "./stocks.interface"

export default interface IProduct {
    id: string
    name: string
    slug: string
    price: number
    weight: number
    Stocks: IStock[]
    created_at?: string
    updated_at?: string
    deleted_at?: string | Object
}