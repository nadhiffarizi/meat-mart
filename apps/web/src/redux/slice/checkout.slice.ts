import { ICheckout } from "@/interface/checkout.interface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const checkoutInitialState: ICheckout = {
    cart: false,
    address: false,
    payment: false,
    success: false
}


const checkoutSlice = createSlice({
    name: "checkoutState",
    initialState: checkoutInitialState,
    reducers: {
        updateCheckoutProgress: (state: ICheckout, action: PayloadAction<string>) => {
            let temp = { ...state }
            switch (action.payload) {
                case 'CART':
                    temp = { ...checkoutInitialState }
                    temp.cart = true
                    break;
                case 'ADDRESS':
                    temp = { ...checkoutInitialState }
                    temp.address = true
                    break;
                case 'PAYMENT':
                    temp = { ...checkoutInitialState }
                    temp.payment = true
                    break;
                case 'SUCCESS':
                    temp = { ...checkoutInitialState }
                    temp.success = true
                    break;

            }
            state = { ...temp }
            return state
        }
    }
})

export const { updateCheckoutProgress } = checkoutSlice.actions;
export default checkoutSlice.reducer