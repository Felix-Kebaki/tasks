import { UPCOMING_URL } from "../constants";
import { apiSlice } from "../api/apiSlice";

const upcomingApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUpcomings: builder.query({
      query: ({ year, month }) => ({
        url: `${UPCOMING_URL}/getUpcoming/${year}/${month}`,
        method: "GET",
      }),
    }),
    createEvent: builder.mutation({
      query: (data) => ({
        url: `${UPCOMING_URL}/createUpcoming`,
        method: "POST",
        body: data,
      }),
    }),
    deleteUpcoming: builder.mutation({
      query: ({ date }) => ({
        url: `${UPCOMING_URL}/deleteUpcoming/${date}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetUpcomingsQuery,
  useCreateEventMutation,
  useDeleteUpcomingMutation,
} = upcomingApiSlice;
