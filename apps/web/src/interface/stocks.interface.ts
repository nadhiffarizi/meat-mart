export default interface IStock {
    id: string
    quantity: number,
    stores: {
        store_id: string,
        status: string,
        distance: number
    }
} 