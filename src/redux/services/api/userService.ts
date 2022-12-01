import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AppConstants } from "../AppConstants";
import { apiEndpoints } from "../endpoints";

export const usersService = createApi({
  reducerPath: "usersService",
  baseQuery: fetchBaseQuery({ baseUrl: AppConstants.baseUrl }),
  endpoints: (builder) => ({
    getUsersList: builder.mutation({
      query: () => ({
        url: `/${apiEndpoints.userEndpoints.getListOfUsers}?populate=*`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${AppConstants.token}`
        }
      })
    }),
    createUser: builder.mutation({
      query: (body) => ({
        url: `/${apiEndpoints.userEndpoints.getListOfUsers}`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${AppConstants.token}`
        },
        body: body.payload
      })
    }),
    getDropdownUsersList: builder.mutation({
      query: (body) => ({
        url: `/${apiEndpoints.userEndpoints.getListOfUsers}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${AppConstants.token}`
        }
      })
    }),
    followUser: builder.mutation({
      query: (body) => ({
        url: `/${apiEndpoints.userEndpoints.getListOfUsers}/${body.selectedUser}`,
        method: "PUT",
        headers: {
          Authorization: `Bearer ${AppConstants.token}`
        },
        body: body.payload
      })
    })
  })
});

export const {
  useGetUsersListMutation,
  useCreateUserMutation,
  useGetDropdownUsersListMutation,
  useFollowUserMutation
} = usersService;
