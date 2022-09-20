import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userService from "../services/users";

const userSlice = createSlice({
  name: "users",
  initialState: [],
  reducers: {
    setUsers: (state, action) => {
      return action.payload;
    },
  },
});

const { setUsers } = userSlice.actions;

export const fetchUsers = createAsyncThunk(
  "users/setUsers",
  async (_, thunkAPI) => {
    const users = await userService().getAll();
    thunkAPI.dispatch(setUsers(users));
  }
);

export default userSlice.reducer;
