import { apiSlice } from "./apiSlice";
import { SUBSCRIBE_URL } from "../constants";

const subscriptionApiSlice=apiSlice.injectEndpoints({
    endpoints:(builder)=>({
        createSubscription:builder.mutation({
            query:({data})=>({
                url:`${SUBSCRIBE_URL}/createSubscription`,
                method:"POST",
                body:data
            })
        }),
        getSubscription:builder.query({
            query:()=>({
                url:`${SUBSCRIBE_URL}/getSubscription`,
                method:"GET"
            })
        }),
        deleteSubs:builder.mutation({
            query:()=>({
                url:`${SUBSCRIBE_URL}/deleteSubscriber`,
                method:"DELETE"
            })
        })
    })
})

export const {useGetSubscriptionQuery,useDeleteSubsMutation,useCreateSubscriptionMutation}=subscriptionApiSlice;
