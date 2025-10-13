import { TEAMTASK_URL } from "../constants";
import { apiSlice } from "./apiSlice";

const teamTaskApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createTeamtask: builder.mutation({
      query: ({ data, teamId }) => {
        if (data.type === "Link") {
          return {
            url: `${TEAMTASK_URL}/createTeamtask/${teamId}`,
            method: "POST",
            body: data,
          };
        }
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("dueDate", data.dueDate);
        formData.append("type", data.type);
        formData.append("file", data.file);

        return {
          url: `${TEAMTASK_URL}/createTeamtask/${teamId}`,
          method: "POST",
          body: formData,
        };
      },
    }),
    editTheTeamtask: builder.mutation({
      query: ({ data, teamtaskId }) => {
        if (data.fileType === "Link" || data.fileType==="None") {
          return {
            url: `${TEAMTASK_URL}/updateTeamtask/${teamtaskId}`,
            method: "PUT",
            body: data,
          };
        }

        const formData = new FormData();
        formData.append("fileType", data.fileType);
        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("dueDate", data.dueDate);
        formData.append("file", data.file);
       
        return {
          url: `${TEAMTASK_URL}/updateTeamtask/${teamtaskId}`,
          method: "PUT",
          body: formData,
        };
      },
    }),
    deleteTeamtask: builder.mutation({
      query: (id) => ({
        url: `${TEAMTASK_URL}/deleteTeamtask/${id}`,
        method: "DELETE",
      }),
    }),
    getSubmissions: builder.query({
      query: ({ teamtaskId }) => ({
        url: `${TEAMTASK_URL}/getTeamtaskSubmissions/${teamtaskId}`,
        method: "GET",
      }),
    }),
    getEachTeamtask: builder.query({
      query: (teamtaskId) => ({
        url: `${TEAMTASK_URL}/getEachTeamtask/${teamtaskId}`,
        method: "GET",
      }),
    })
  }),
});

export const {
  useCreateTeamtaskMutation,
  useDeleteTeamtaskMutation,
  useGetSubmissionsQuery,
  useGetEachTeamtaskQuery,
  useEditTheTeamtaskMutation
} = teamTaskApiSlice;


        