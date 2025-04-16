import { ICart } from "@/interface/cart.interface";
import IStock from "@/interface/stocks.interface";
import prisma from "@/prisma";
import { chooseStock, findStockById } from "../stock/stock.helper";
import { IOrderInput } from "@/interface/order.interface";

export const addToCart = async (stocks: IStock[], qtty: number, userId: string, existingCart?: ICart) => {

    // get which stock
    const chosenStockId = chooseStock(stocks, qtty, existingCart, 'ADD')
    if (!chosenStockId) throw new Error("Cannot find stock, try again later")

    // add if chosenStock found
    const stock = await findStockById(chosenStockId)
    //check available quantity in stock

    if (!existingCart) {
        const exceedMaximum: boolean = qtty >= stock?.quantity! ? true : false
        // add new cart item
        const data = await prisma.carts.create({
            data: {
                quantity: exceedMaximum ? stock?.quantity! : qtty,
                user_id: userId,
                stock_id: chosenStockId!,
                created_at: (new Date()),
                updated_at: new Date()
            }
        })
        return data
    } else if (existingCart) {
        //check available quantity in stock
        const resultQtty = existingCart.quantity + qtty

        const exceedMaximum: boolean = resultQtty >= stock?.quantity! ? true : false

        // add to exisitng cart
        const data = await prisma.carts.update({
            where: {
                id: existingCart.id
            }, data: {
                quantity: exceedMaximum ? stock?.quantity : resultQtty,
                stock_id: chosenStockId
            }
        })
        return data

    } else {
        throw new Error("Cannot add to cart, stock insufficient.")
    }
}

export const subtractCart = async (stocks: IStock[], qtty: number, userId: string, existingCart: ICart) => {

    if (!existingCart) throw new Error("cannot find item to be subtract in cart")

    // get which stock 
    const chosenStockId = chooseStock(stocks, qtty, existingCart, 'SUBTRACT')
    if (!chosenStockId) throw new Error("Cannot find stock, try again later")

    // subtract if chosenStock found
    const stock = await findStockById(chosenStockId)
    // check if the subtraction will result 0 in qtty
    const resultQtty = existingCart.quantity - qtty
    if (resultQtty === 0) {
        // delete data in cart
        await prisma.carts.delete({
            where: {
                id: existingCart.id
            }
        })
        const updatedCart = await prisma.carts.findMany({
            where: {
                user_id: userId
            }
        })

        return updatedCart
    } else if (resultQtty > stock?.quantity!) {
        // update cart with maximum quantity available
        await prisma.carts.update({
            where: {
                id: existingCart.id
            }, data: {
                quantity: stock?.quantity!,
                stock_id: chosenStockId!
            }
        })

        const updatedCart = await prisma.carts.findMany({
            where: {
                user_id: userId
            }
        })

        return updatedCart
    } else if (resultQtty <= stock?.quantity!) {
        // update cart minus the qtty
        await prisma.carts.update({
            where: {
                id: existingCart.id
            }, data: {
                quantity: existingCart.quantity - qtty,
                stock_id: chosenStockId!
            }
        })

        const updatedCart = await prisma.carts.findMany({
            where: {
                user_id: userId
            }
        })

        return updatedCart
    }
}

export const updateCartQuantity = async (stocks: IStock[], qtty: number, userId: string, existingCart: ICart) => {
    // choose stock
    const chosenStockId = chooseStock(stocks, qtty, existingCart, 'UPDATE')
    // console.log(stocks);

    if (!chosenStockId) throw new Error("Cannot find chosen stock")

    const maxAvailableQuantity = (await findStockById(chosenStockId))?.quantity!
    if (qtty > maxAvailableQuantity) {
        const updatedCartItem = await prisma.carts.update({
            where: {
                id: existingCart.id
            }, data: {
                quantity: maxAvailableQuantity,
                stock_id: chosenStockId,
            }
        })

        return updatedCartItem
    } else {
        const updatedCartItem = await prisma.carts.update({
            where: {
                id: existingCart.id
            }, data: {
                quantity: qtty,
                stock_id: chosenStockId,
            }
        })

        return updatedCartItem
    }
}

export const isMaxAdded = async (stockId: string, qtty: number, existingCart?: ICart) => {
    const stock = await prisma.stocks.findUnique({
        where: {
            id: stockId
        }
    })

    // not existed yet
    if (!existingCart && stock?.quantity !== 0) return false

    // existed
    console.log("exisitng cart qtty: ", existingCart?.quantity);
    console.log("stock available qtty: ", stock?.quantity);

    if ((existingCart?.quantity! + qtty) <= stock?.quantity!) return false

    return true

}

export const findCartByOrderInput = async (orderInput: IOrderInput[], userId: string) => {
    if (orderInput.length === 0 || userId.length === 0) return null // no cart data given

    const data = await prisma.carts.findMany({
        where: {
            id: {
                in: orderInput.map((orderData) => orderData.cartId)
            }, AND: {
                user_id: userId
            }
        }
    })
    return data

}

export const findCartById = async (cartId: string) => {
    /**returns cart data */
    const cartData = await prisma.carts.findUnique({
        where: {
            id: cartId
        }
    })

    return cartData
}

export const disableCart = async (cartId: string) => {
    // disable cart, add new Date() to deleted_at columns
    const updatedCart = await prisma.carts.update({
        where: {
            id: cartId
        }, data: {
            deleted_at: new Date()
        }
    })
}
