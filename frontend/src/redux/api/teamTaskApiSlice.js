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
        if(data.files){
          data.files.forEach((file)=>{
            formData.append("files",file)
          })
        }

        return {
          url: `${TEAMTASK_URL}/createTeamtask/${teamId}`,
          method: "POST",
          body: formData,
        };
      },
    }),
    editTheTeamtask: builder.mutation({
      query: ({ data, teamtaskId }) => {
        if (data.fileType === "Link" || data.fileType === "None") {
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
        if(data.files){
          data.files.forEach((file)=>{
            formData.append("files",file)
          })
        }

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
    }),
    addResourcesApi: builder.mutation({
      query: ({ data, id }) => {
        if (data.type === "Link") {
          return {
            url: `${TEAMTASK_URL}/addResource/${id}`,
            method: "POST",
            body: data,
          };
        }

        const formData = new FormData();
        formData.append("type", data.type);
        if (data.files) {
          data.files.forEach((file) => {
            formData.append("files", file);
          });
        }

        return {
          url: `${TEAMTASK_URL}/addResource/${id}`,
          method: "POST",
          body: formData,
        };
      },
    }),
  }),
});

export const {
  useCreateTeamtaskMutation,
  useDeleteTeamtaskMutation,
  useGetSubmissionsQuery,
  useGetEachTeamtaskQuery,
  useEditTheTeamtaskMutation,
  useAddResourcesApiMutation,
} = teamTaskApiSlice;
