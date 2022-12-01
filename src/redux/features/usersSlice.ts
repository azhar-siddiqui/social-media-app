import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../app/store";

interface UsersState {
  data: null | [];
}

const initialState: UsersState = {
  data: null
};

export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUsers: (state, payload) => {
      state.data = payload.payload;
    },
    resetUsers: (state) => {
      state = initialState;
    }
  }
});

export const { setUsers, resetUsers } = usersSlice.actions;

export const selectUsers = (state: RootState) => state.users.data;

export default usersSlice.reducer;
