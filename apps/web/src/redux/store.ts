import { combineReducers, configureStore } from "@reduxjs/toolkit";
import cartSlice from './slice/cart.slice'
import userSlice from './slice/user.slice'
import addressSlice from './slice/address.slice'
import checkoutSlice from './slice/checkout.slice'
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

const reducerCombined = combineReducers({
    cartState: cartSlice,
    userState: userSlice,
    addressState: addressSlice,
    checkoutState: checkoutSlice
})

export const store = configureStore({
    reducer: reducerCombined
})

export type RootState = ReturnType<typeof store.getState>
export type AddDispatch = typeof store.dispatch

export const useAppDispatch: () => AddDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector