import { apiSlice } from "./apiSlice";
import { TEAM_URL } from "../constants";

const teamApiSlice=apiSlice.injectEndpoints({
    endpoints:(builder)=>({
        getYourTeams:builder.query({
            query:()=>({
                url:`${TEAM_URL}/getTeams`,
                method:"GET"
            })
        }),
        createTeam:builder.mutation({
            query:(data)=>({
                url:`${TEAM_URL}/createTeam`,
                method:"POST",
                body:data
            })
        }),
        deleteTeam:builder.mutation({
            query:(id)=>({
                url:`${TEAM_URL}/deleteTeam/${id}`,
                method:'DELETE',
            })
        }),
        getMembers:builder.query({
            query:({teamId})=>({
                url:`${TEAM_URL}/teamMembers/${teamId}`,
                method:"GET"
            })
        })
    })
})

export const {useGetYourTeamsQuery,useCreateTeamMutation,useDeleteTeamMutation,useGetMembersQuery}=teamApiSlice