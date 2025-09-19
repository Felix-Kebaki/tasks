import { USER_URL } from "../constants";
import { apiSlice } from "./apiSlice";

const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/login`,
        method: "POST",
        body: data,
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/register`,
        method: "POST",
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${USER_URL}/logout`,
        method: "POST",
      }),
    }),
    editPassword: builder.mutation({
      query: ({ data }) => ({
        url: `${USER_URL}/editPassword`,
        method: "PUT",
        body: data,
      }),
    }),
    editProfile: builder.mutation({
      query: ({ data }) => ({
        url: `${USER_URL}/editProfile`,
        method: "PUT",
        body: data,
      }),
    }),
    deleteAccount:builder.mutation({
      query:()=>({
        url:`${USER_URL}/deleteAccount`,
        method:"DELETE"
      })
    })
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useEditPasswordMutation,
  useEditProfileMutation,
  useDeleteAccountMutation
} = userApiSlice;
