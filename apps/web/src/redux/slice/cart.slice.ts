import { createNewCartItem, indexCartById, indexProductInCart, maxStockAvailable } from "@/helper/cart.helper";
import { syncRedeemedDiscountFromAPI } from "@/helper/discount.helper";
import { ICart } from "@/interface/cart.interface";
import { IDiscount } from "@/interface/discount.interface";
import IProduct from "@/interface/product.interface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const cartInitalState: ICart[] = []


const cartSlice = createSlice({
    name: "cartSlice",
    initialState: cartInitalState,
    reducers: {
        updateCartState: (state: ICart[], action: PayloadAction<ICart[]>) => {
            // sync cart from database to local global state
            state = [...action.payload]
            console.log(state);

            return state
        },

        addToCartState: (state: ICart[], action: PayloadAction<{ product: IProduct, qtty: number }>) => {
            // temp state 
            const tempState = [...state]

            // checks if the product already inside cart
            if (indexProductInCart(tempState, action.payload.product) == -1) {
                // add new cart item
                const newCartItem = createNewCartItem(action.payload.product, 1)
                tempState.unshift(newCartItem)

                state = [...tempState]

                // call addToCart API to update cart data in DB

                return state

            } else {
                // add to existing cart item
                const index = indexProductInCart(tempState, action.payload.product);

                const productInCart = tempState[index]

                // checks if the qtty stated in product already maximum
                if (productInCart.quantity !== maxStockAvailable(action.payload.product).maxStockAvailable) {
                    // add quantity to the same product data

                    const tempProduct: ICart = { ...productInCart }
                    tempProduct.quantity += 1

                    tempState[index] = { ...tempProduct }

                    state = [...tempState]
                    console.log(state);

                    // call addToCart API to update cart data in DB

                    return state
                } else {
                    // qtty already the same as max available
                    state = [...tempState]
                    return state
                }
            }
        },

        subtractCartState: (state: ICart[], action: PayloadAction<{ product: IProduct, qtty: number }>) => {
            // temp state
            const tempState = [...state]

            // find where is the product in the cart
            const indexProduct = indexProductInCart(tempState, action.payload.product) // strictly available
            const resultQtty = tempState[indexProduct].quantity - action.payload.qtty
            if (resultQtty < 0) {
                state = [...tempState]
                return state
            }


            // remove the product because resulting 0 in qtty state
            if (resultQtty === 0) {
                tempState.splice(indexProduct, 1)
                state = [...tempState]
                return state
            }

            // subtract the product 
            const tempProductInCart: ICart = { ...tempState[indexProduct] }
            tempProductInCart.quantity = resultQtty

            tempState[indexProduct] = { ...tempProductInCart }
            console.log((tempState));

            state = [...tempState]

            return state
        },

        addDiscountToCartItem: (state: ICart[], action: PayloadAction<{ data: any, cartId: string }>) => {
            // temp state
            const tempState = [...state]

            // find where is the product in the cart
            const indexCart = indexCartById(tempState, action.payload.cartId) // strictly available
            const tempCartItem = { ...tempState[indexCart] }

            const redeemDiscount = syncRedeemedDiscountFromAPI(action.payload.data)
            // console.log("here", redeemDiscount);


            tempCartItem.discount = { ...redeemDiscount.discount }
            tempCartItem.quantityAfterDisc = redeemDiscount.quantityAfterDisc
            tempCartItem.subtotalPrice = redeemDiscount.subtotalPrice
            tempCartItem.pricePerProduct = redeemDiscount.pricePerProduct

            tempState[indexCart] = { ...tempCartItem }

            state = [...tempState]

            return state
        }

    }
})

export const { updateCartState, addToCartState, subtractCartState, addDiscountToCartItem } = cartSlice.actions;
export default cartSlice.reducer