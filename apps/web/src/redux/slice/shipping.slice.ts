import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ShippingState {
  price: number | null;
  selectedOption: {
    courier_name: string;
    courier_service_name: string;
    price: number;
    duration: string;
  } | null;
}

const initialState: ShippingState = {
  price: null,
  selectedOption: null,
};

const shippingSlice = createSlice({
  name: 'shipping',
  initialState,
  reducers: {
    setShippingPrice: (state, action: PayloadAction<number>) => {
      state.price = action.payload;
    },
    setShippingOption: (
      state,
      action: PayloadAction<ShippingState['selectedOption']>,
    ) => {
      state.selectedOption = action.payload;
      if (action.payload) {
        state.price = action.payload.price;
      }
    },
    clearShipping: (state) => {
      state.price = null;
      state.selectedOption = null;
    },
  },
});

export const { setShippingPrice, setShippingOption, clearShipping } =
  shippingSlice.actions;
export default shippingSlice.reducer;
