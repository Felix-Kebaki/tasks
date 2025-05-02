import { ASSIGNTASK_URL } from "../constants";
import { apiSlice } from "./apiSlice";

const assignTaskApiSlice=apiSlice.injectEndpoints({
    endpoints:(builder)=>({
        assignTask:builder.mutation({
            query:({teamId,teamTaskId,userId,data})=>({
                url:`${ASSIGNTASK_URL}/assignTask/${teamId}/${teamTaskId}/${userId}`,
                method:"POST",
                body:data
            })
        }),
        getAssigned:builder.query({
            query:()=>({
                url:`${ASSIGNTASK_URL}/getAssignedtask`,
                method:"GET"
            })
        }),
        getAssignedMembers:builder.query({
            query:({teamId})=>({
                url:`${ASSIGNTASK_URL}/getAssignedwithMember/${teamId}`,
                method:"GET"
            })
        })
    })
})


export const {useAssignTaskMutation,useGetAssignedQuery,useGetAssignedMembersQuery}=assignTaskApiSlice