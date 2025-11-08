// client/src/Features/auth/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const getInitialState = () => {
  const storedToken = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");

  // ✅ SIMPLIFIED TOKEN CHECK
  const validToken =
    storedToken && storedToken !== "undefined" && storedToken !== "null";

  return {
    user: storedUser ? JSON.parse(storedUser) : null,
    isAuthenticated: !!validToken,
    isLoading: false,
    token: validToken ? storedToken : null,
  };
};

const authSlice = createSlice({
  name: "auth",
  initialState: getInitialState(),
  reducers: {
    loginUser: (state, action) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.token = action.payload.token;

      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },
    logoutUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.token = null;

      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem("user", JSON.stringify(state.user));
    },
  },
});

export const { loginUser, logoutUser, setLoading, updateUser } =
  authSlice.actions;
export default authSlice.reducer;
