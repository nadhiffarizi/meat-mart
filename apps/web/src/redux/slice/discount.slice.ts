import { IDiscount } from "@/interface/discount/discount.interface"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

const discountInitialState: IDiscount = {}


const discountSlice = createSlice({
    name: "checkoutState",
    initialState: discountInitialState,
    reducers: {
        selectDiscount: (state: IDiscount, action: PayloadAction<{ discount: IDiscount }>) => {
            return state
        }
    }
})

export const { selectDiscount } = discountSlice.actions;
export default discountSlice.reducer