import { userLoggedIn, userLoggedOut } from "@/features/authSlice";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const USER_API = "/api/v1/user";

/* ---------------- BASE QUERY ---------------- */
const baseQuery = fetchBaseQuery({
  baseUrl: USER_API,
  credentials: "include",
});

/* ---------------- API ---------------- */
export const authApi = createApi({
  reducerPath: "authApi",
  tagTypes: ["User"],
  baseQuery,
  endpoints: (builder) => ({

    /* ---------------- REGISTER ---------------- */
    registerUser: builder.mutation({
      query: (formData) => ({
        url: "/register",
        method: "POST",
        body: formData,
      }),
    }),

    /* ---------------- LOGIN ---------------- */
    loginUser: builder.mutation({
      query: (formData) => ({
        url: "/login",
        method: "POST",
        body: formData,
      }),

      invalidatesTags: ["User"],

      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(userLoggedIn({ user: data.user }));
        } catch (error) {
          console.error("Login error:", error);
        }
      },
    }),

    /* ---------------- LOAD USER ---------------- */
    loadUser: builder.query({
      query: () => ({
        url: "/profile",
        method: "GET",
      }),

      providesTags: ["User"],

      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(userLoggedIn({ user: data.user }));
        } catch (error) {
          console.error("Load user error:", error);

          // Auto logout on unauthorized
          if (error?.error?.status === 401) {
            dispatch(userLoggedOut());
          }
        }
      },
    }),

    /* ---------------- LOGOUT ---------------- */
    logoutUser: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "GET",
      }),

      invalidatesTags: ["User"],

      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          await queryFulfilled;
        } finally {
          dispatch(userLoggedOut());
        }
      },
    }),

    /* ---------------- UPDATE PROFILE ---------------- */
    updateProfile: builder.mutation({
      query: (formData) => ({
        url: "/profile/update",
        method: "PUT",
        body: formData,
      }),

      invalidatesTags: ["User"],
    }),

    /* ---------------- CHECK AUTH ---------------- */
    checkAuth: builder.query({
      query: () => ({
        url: "/check-auth",
        method: "GET",
      }),
    }),
  }),
});

/* ---------------- EXPORTS ---------------- */
export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useLogoutUserMutation,
  useUpdateProfileMutation,
  useCheckAuthQuery,
  useLoadUserQuery,
} = authApi;
