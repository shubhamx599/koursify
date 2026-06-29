// client/src/Features/Apis/authApi.js
import { createApi } from "@reduxjs/toolkit/query/react";
import { loginUser, logoutUser, updateUser as updateAuthUser } from "../auth/authSlice.js";
import { createAuthenticatedBaseQuery } from "./baseQuery.js";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: createAuthenticatedBaseQuery("user"),
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

    updateUser: builder.mutation({
      query: (formData) => ({
        url: "get-profile/update-Profile",
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["User"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.success && data.updatedUser) {
            dispatch(updateAuthUser(data.updatedUser));
          }
        } catch (error) {
          console.error("Profile update failed:", error);
        }
      },
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
  useUpdateUserMutation,
  useLogoutUserMutation,
} = authApi;
