
import { IUser } from "@/interface/user/user.interface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const userInitialState: IUser = {
  email: '',
  first_name: '',
  last_name: '',
  role: '',
  id: '',
};

const userSlice = createSlice({
  name: 'userSlice',
  initialState: userInitialState,
  reducers: {
    updateUserState: (state: IUser, action: PayloadAction<IUser>) => {
      state = { ...action.payload };
      return state;
    },
  },
});

export const { updateUserState } = userSlice.actions;
export default userSlice.reducer;
