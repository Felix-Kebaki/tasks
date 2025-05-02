import { INVITE_URL } from "../constants";
import { apiSlice } from "./apiSlice";

const invitesApiSlice=apiSlice.injectEndpoints({
    endpoints:(builder)=>({
        sendInvite:builder.mutation({
            query:({data,teamId})=>({
                url:`${INVITE_URL}/sendInvite/${teamId}`,
                method:"POST",
                body:data
            })
        }),
        receiveInvite:builder.mutation({
            query:({inviteId,data})=>({
                url:`${INVITE_URL}/receiveInvite/${inviteId}`,
                method:"POST",
                body:data
            })
        })
    })
})

export const {useSendInviteMutation,useReceiveInviteMutation}=invitesApiSlice