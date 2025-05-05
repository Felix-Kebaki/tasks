import { apiSlice } from "./apiSlice";
import { NOTIFY_URL } from "../constants";

const notifyApiSlice=apiSlice.injectEndpoints({
    endpoints:(builder)=>({
        getUnread:builder.query({
            query:()=>({
                url:`${NOTIFY_URL}/getUnread`,
                method:"GET"
            })
        }),
        markAsSeen:builder.mutation({
            query:()=>({
                url:`${NOTIFY_URL}/markallSeen`,
                method:"POST"
            })
        }),
        markOneSeen:builder.mutation({
            query:(id)=>({
                url:`${NOTIFY_URL}/markOneSeen/${id}`,
                method:"POST"
            })
        }),
        getRead:builder.query({
            query:()=>({
                url:`${NOTIFY_URL}/getAllNotifications`,
                method:"GET"
            })
        })
    })
})

export const {useGetUnreadQuery,useMarkAsSeenMutation,useMarkOneSeenMutation,useGetReadQuery}=notifyApiSlice