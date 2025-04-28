import IAddress from "@/interface/address.interface";
import { ICart } from "@/interface/cart.interface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const addressInitalState: IAddress = {
    address: "",
    latitude: "",
    longitude: ""
}


const addressSlice = createSlice({
    name: "addressSlice",
    initialState: addressInitalState,
    reducers: {
        updateAddressState: (state: IAddress, action: PayloadAction<IAddress>) => {
            state = action.payload
            return state
        }
    }
})

export const { updateAddressState } = addressSlice.actions;
export default addressSlice.reducer