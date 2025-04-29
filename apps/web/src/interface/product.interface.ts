import IStock from "./stocks.interface"

export default interface IProduct {
    id: string
    name: string
    slug: string
    price: number
    weight: number
    image?: string
    availableStocks: IStock[]
}