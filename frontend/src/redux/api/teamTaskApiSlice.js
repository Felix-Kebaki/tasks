import { TEAMTASK_URL } from "../constants";
import { apiSlice } from "./apiSlice";


const teamTaskApiSlice=apiSlice.injectEndpoints({
    endpoints:(builder)=>({
        createTeamtask:builder.mutation({
            query:({data,teamId})=>({
                url:`${TEAMTASK_URL}/createTeamtask/${teamId}`,
                method:"POST",
                body:data,
            })
        }),
        getTeamtask:builder.query({
            query:({teamId})=>({
                url:`${TEAMTASK_URL}/getTeamtask/${teamId}`,
                method:"GET"
            })
        })
    })
})

export const {useCreateTeamtaskMutation,useGetTeamtaskQuery}=teamTaskApiSlice