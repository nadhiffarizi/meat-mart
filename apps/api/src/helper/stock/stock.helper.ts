import { ICart } from "@/interface/cart.interface"
import IStock from "@/interface/stocks.interface"
import { xDistancePrisma } from "../location/distance.helper"
import ILocation from "@/interface/location.interface"
import prisma from "@/prisma"

export const chooseStock = (stocks: IStock[], qtty: number, existingCart?: ICart, method?: string) => {
    let stockId = null

    if (stocks.length === 1 && stocks.at(0)?.quantity === 0) {
        stockId = null
        return stockId // stock central applied
    } else if (stocks.length === 1 && stocks.at(0)?.quantity !== 0) {
        stockId = stocks.at(0)?.id
        return stockId
    }

    if (!existingCart) {
        stocks[0].quantity !== 0 ? (stockId = stocks[0].id) : (stockId = stocks[1].id)
        if (stocks[0].quantity >= qtty) return stocks[0].id
        if (stocks[1].quantity > qtty) return stocks[1].id
        stockId = null
        return stockId
    } else {
        // exist in existing cart
        const qttyInCart = existingCart.quantity

        //get current stockId
        const indexStock = stocks.findIndex((stock) => stock.id === existingCart.stock_id)

        // get central index
        const indexCentral = stocks.findIndex((stock) => stock.stores.status === 'CENTRAL')

        switch (method) {
            case 'ADD':
                if ((qttyInCart + qtty) <= stocks[indexStock].quantity) {
                    stockId = existingCart.stock_id
                    return stockId
                } else if ((qttyInCart + qtty) < stocks[indexCentral].quantity) {
                    stockId = stocks[indexCentral].id
                    return stockId

                } else {
                    stockId = null
                    return stockId
                }
            case 'SUBTRACT':
                if (qttyInCart !== 0 && (qttyInCart - qtty) <= stocks[indexStock].quantity && stocks[indexStock].stores.status === 'BRANCH') {
                    stockId = existingCart.stock_id
                    return stockId
                } else if (qttyInCart !== 0 && (qttyInCart - qtty) > stocks[stocks.findIndex((stock) => stock.stores.status === 'BRANCH')].quantity) {
                    stockId = stocks[indexCentral].id
                    return stockId

                } else if (qttyInCart !== 0 && (qttyInCart - qtty) <= stocks[stocks.findIndex((stock) => stock.stores.status === 'BRANCH')].quantity) {
                    stockId = stocks[stocks.findIndex((stock) => stock.stores.status === 'BRANCH')].id
                    return stockId
                } else {
                    stockId = null
                    return stockId
                }
            case 'UPDATE':
                const alterativeStockIndex = stocks.findIndex((stock) => stock.id !== existingCart.stock_id)
                if (qttyInCart < stocks[alterativeStockIndex].quantity) {
                    stockId = stocks[alterativeStockIndex].id
                    return stockId
                } else {
                    stockId = existingCart.stock_id
                    return stockId
                }

        }
    }

}

export const findStocksByProduct = async (productId: string, userLoc: ILocation) => {
    const stocks = await xDistancePrisma(userLoc).stocks.findMany({
        select: {
            id: true,
            quantity: true,
            stores: {
                select: {
                    id: true,
                    status: true,
                    distance: true
                }
            }
        },
        where: {
            product_id: productId
        }
    })

    // preprocessing stocks into only two maximum (CENTRAL and/or BRANCH)
    const sortedStocks = stocks.sort((a, b) => a.stores.distance - b.stores.distance)
    const smallestDistance = sortedStocks.splice(0, 1)

    // return smallestDistance
    if (smallestDistance[0].stores.status === 'CENTRAL') {
        if (smallestDistance[0].quantity !== 0) {

            return smallestDistance // have stock in only central
        }
        return [] // dont have anymore stock
    } else {

        const findCentral = sortedStocks.findIndex((stock) => stock.stores.status === 'CENTRAL') // must exist in db
        if (smallestDistance[0].quantity !== 0) {

            // if branch stock is not 0
            if (sortedStocks[findCentral].quantity !== 0) {
                const stocksByProduct = [smallestDistance[0], sortedStocks[findCentral]]

                return stocksByProduct // have stock both in branch and central
            } else {
                return smallestDistance // have stock only in branch
            }
        } else {
            // if branch stock is 0
            if (sortedStocks[findCentral].quantity !== 0) {
                return [sortedStocks[findCentral]] // have stock only in central
            } else {
                return [] // dont have stocks anywhere
            }
        }
    }
}

export const findStockById = async (stockId: string) => {
    const stock = await prisma.stocks.findUnique({
        where: {
            id: stockId
        }
    })

    return stock
}

export const findStockByCartId = async (cartId: string) => {
    // find stockId
    const stockId = await prisma.carts.findUnique({
        select: {
            stock_id: true
        },
        where: {
            id: cartId
        }
    })

    if (!stockId) throw new Error("stockId by cartId not found")

    return stockId
}
