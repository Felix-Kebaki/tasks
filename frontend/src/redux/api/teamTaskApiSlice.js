import { TEAMTASK_URL } from "../constants";
import { apiSlice } from "./apiSlice";

const teamTaskApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createTeamtask: builder.mutation({
      query: ({ data, teamId }) => {
        if(data.type==="Link"){
          return {
            url: `${TEAMTASK_URL}/createTeamtask/${teamId}`,
            method: "POST",
            body: data,
          }
        }
          const formData = new FormData();
          formData.append('name', data.name);
          formData.append('description', data.description);
          formData.append('dueDate', data.dueDate);
          formData.append('type', data.type);
          formData.append('file', data.file);
      
          return {
            url: `${TEAMTASK_URL}/createTeamtask/${teamId}`,
            method: 'POST',
            body: formData
          };
        
      },
    }),
    getTeamtask: builder.query({
      query: ({ teamId }) => ({
        url: `${TEAMTASK_URL}/getTeamtask/${teamId}`,
        method: "GET",
      }),
    }),
    deleteTeamtask: builder.mutation({
      query: ({ teamtaskId }) => ({
        url: `${TEAMTASK_URL}/deleteTeamtask/${teamtaskId}`,
        method: "DELETE",
      }),
    }),
    getSubmissions:builder.query({
      query:({teamtaskId})=>({
        url:`${TEAMTASK_URL}/getTeamtaskSubmissions/${teamtaskId}`,
        method:"GET"
      })
    })
  }),
});

export const {
  useCreateTeamtaskMutation,
  useGetTeamtaskQuery,
  useDeleteTeamtaskMutation,
  useGetSubmissionsQuery
} = teamTaskApiSlice;
