import { apiSlice } from "./apiSlice";
import { TEAM_URL } from "../constants";

const teamApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getYourTeams: builder.query({
      query: () => ({
        url: `${TEAM_URL}/getTeams`,
        method: "GET",
      }),
    }),
    createTeam: builder.mutation({
      query: (data) => ({
        url: `${TEAM_URL}/createTeam`,
        method: "POST",
        body: data,
      }),
    }),
    deleteTeam: builder.mutation({
      query: ({ teamId }) => ({
        url: `${TEAM_URL}/deleteTeam/${teamId}`,
        method: "DELETE",
      }),
    }),
    getTeamdashboard: builder.query({
      query: ({ id }) => ({
        url: `${TEAM_URL}/teamDashboard/${id}`,
        method: "POST",
      }),
    }),
    checkUser: builder.mutation({
      query: (body) => ({
        url: `${TEAM_URL}/checkuser`,
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useGetYourTeamsQuery,
  useCreateTeamMutation,
  useDeleteTeamMutation,
  useGetTeamdashboardQuery,
  useCheckUserMutation,
} = teamApiSlice;
