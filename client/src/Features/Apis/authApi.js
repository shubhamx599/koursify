// client/src/Features/Apis/authApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { loginUser, logoutUser } from "../auth/authSlice.js";

const Base_USER_AUTH_API = "https://koursify-backend.onrender.com/api/user/";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: Base_USER_AUTH_API,
    // ✅ REMOVED: credentials: "include" - we're using Bearer token only

    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");

      // ✅ SIMPLIFIED TOKEN CHECK
      if (token && token !== "undefined" && token !== "null") {
        headers.set("Authorization", `Bearer ${token}`);
      }

      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (formData) => ({
        url: "register",
        method: "POST",
        body: formData, // ✅ REMOVED JSON.stringify - RTK does it automatically
      }),
    }),

    uloginUser: builder.mutation({
      query: (formData) => ({
        url: "login",
        method: "POST",
        body: formData, // ✅ REMOVED JSON.stringify
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          if (data.token && data.success) {
            localStorage.setItem("token", data.token);
            dispatch(
              loginUser({
                user: data.user,
                token: data.token,
              })
            );
          }
        } catch (error) {
          console.error("Login failed:", error);
          dispatch(logoutUser());
        }
      },
    }),

    getUser: builder.query({
      query: () => ({
        url: "get-profile",
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    logoutUser: builder.mutation({
      query: () => ({
        url: "logout",
        method: "GET",
      }),
      async onQueryStarted(_, { dispatch }) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        dispatch(logoutUser());
      },
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useUloginUserMutation,
  useGetUserQuery,
  useLogoutUserMutation,
} = authApi;
