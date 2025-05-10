import IStock from "../stock/stocks.interface"

export default interface IProduct {
  id: string
  name: string
  slug: string
  price: number
  weight: number
  image?: string
  availableStocks: IStock[]
}