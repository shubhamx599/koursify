import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const apiRoot = (import.meta.env.VITE_API_BASE_URL || "/api").replace(/\/$/, "");

export const createAuthenticatedBaseQuery = (resource) =>
  fetchBaseQuery({
    baseUrl: `${apiRoot}/${resource}/`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");

      if (token && token !== "undefined" && token !== "null") {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  });
