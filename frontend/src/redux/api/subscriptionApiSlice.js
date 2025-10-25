import { apiSlice } from "./apiSlice";
import { SUBSCRIBE_URL } from "../constants";

const subscriptionApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createSubscription: builder.mutation({
      query: (body) => ({
        url: `${SUBSCRIBE_URL}/createSubscription`,
        method: "POST",
        body,
      }),
    }),
    getSubscription: builder.query({
      query: (endpoint) => ({
        url: `${SUBSCRIBE_URL}/getSubscription?endpoint=${encodeURIComponent(
          endpoint
        )}`,
        method: "GET",
      }),
    }),
    deleteSubs: builder.mutation({
      query: (body) => ({
        url: `${SUBSCRIBE_URL}/deleteSubscriber`,
        method: "DELETE",
        body,
      }),
    }),
  }),
});

export const {
  useGetSubscriptionQuery,
  useDeleteSubsMutation,
  useCreateSubscriptionMutation,
} = subscriptionApiSlice;
