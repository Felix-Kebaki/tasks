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
    getAssignedMembers:builder.query({
      query:(teamId)=>({
        url:`${ASSIGNTASK_URL}/assignedWithMembers/${teamId}`,
        method:"GET"
      })
    }),
    startTeamtask: builder.mutation({
      query: ({ taskId }) => ({
        url: `${ASSIGNTASK_URL}/startTeamtask/${taskId}`,
        method: "POST",
      }),
    }),
    deleteAssignedTask: builder.mutation({
      query: ({ taskId }) => ({
        url: `${ASSIGNTASK_URL}/deleteAssignedtask/${taskId}`,
        method: "DELETE",
      }),
    }),
    markAsDone: builder.mutation({
      query: ({ teamtaskId, data }) => {
        if (data.type === "Link") {
          return {
            url: `${ASSIGNTASK_URL}/completeAssignedtask/${teamtaskId}`,
            method: "POST",
            body: data,
          };
        }
        const formData=new FormData()
        formData.append("type",data.type)
        formData.append('file',data.file)

        return{
          url: `${ASSIGNTASK_URL}/completeAssignedtask/${teamtaskId}`,
          method: "POST",
          body: formData
        }
      },
    }),
  }),
});

export const {
  useAssignTaskMutation,
  useGetAssignedQuery,
  useGetAssignedMembersQuery,
  useStartTeamtaskMutation,
  useDeleteAssignedTaskMutation,
  useMarkAsDoneMutation
} = assignTaskApiSlice;
