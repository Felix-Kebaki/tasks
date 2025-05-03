import { ASSIGNTASK_URL } from "../constants";
import { apiSlice } from "./apiSlice";

const assignTaskApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    assignTask: builder.mutation({
      query: ({ teamId, teamTaskId, userId, data }) => ({
        url: `${ASSIGNTASK_URL}/assignTask/${teamId}/${teamTaskId}/${userId}`,
        method: "POST",
        body: data,
      }),
    }),
    getAssigned: builder.query({
      query: () => ({
        url: `${ASSIGNTASK_URL}/getAssignedtask`,
        method: "GET",
      }),
    }),
    getAssignedMembers: builder.query({
      query: ({ teamId }) => ({
        url: `${ASSIGNTASK_URL}/getAssignedwithMember/${teamId}`,
        method: "GET",
      }),
    }),
    getTeamAssignedTask: builder.query({
      query: ({ taskId, userId }) => ({
        url: `${ASSIGNTASK_URL}/getTeamAssignedTasks/${taskId}/${userId}`,
        method: "GET",
      }),
    }),
    startTeamtask: builder.mutation({
      query: ({ taskId }) => ({
        url: `${ASSIGNTASK_URL}/startTeamtask/${taskId}`,
        method: "POST",
      }),
    }),
    deleteAssignedTask:builder.mutation({
        query:({taskId})=>({
            url:`${ASSIGNTASK_URL}/deleteAssignedtask/${taskId}`,
            method:"DELETE"
        })
    }),
    markAsDone:builder.mutation({
        query:({teamtaskId})=>({
            url:`${ASSIGNTASK_URL}/completeAssignedtask/${teamtaskId}`,
            method:"POST"
        })
    }),
    deleteYourtasks:builder.mutation({
        query:({teamtaskId})=>({
            url:`${ASSIGNTASK_URL}/deleteYourtask/${teamtaskId}`,
            method:"DELETE"
        })
    })
  }),
});

export const {
  useAssignTaskMutation,
  useGetAssignedQuery,
  useGetAssignedMembersQuery,
  useGetTeamAssignedTaskQuery,
  useStartTeamtaskMutation,
  useDeleteAssignedTaskMutation,
  useMarkAsDoneMutation,
  useDeleteYourtasksMutation
} = assignTaskApiSlice;
