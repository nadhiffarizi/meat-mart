
import { getCustomer } from "@/helper/user.helper";
import { ICart } from "@/interface/cart.interface";
import IProduct from "@/interface/product.interface";
import IUser from "@/interface/user.interface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const userInitialState: IUser = {
    email: "",
    first_name: "",
    last_name: "",
    role: "",
    id: ""
}

const userSlice = createSlice({
    name: "userSlice",
    initialState: userInitialState,
    reducers: {
        updateUserState: (state: IUser, action: PayloadAction<IUser>) => {
            state = { ...action.payload }
            return state
        }
    }
})

export const { updateUserState } = userSlice.actions;
export default userSlice.reducer