import { apiSlice } from "./apiSlice";
import { GOAL_URL } from "../constants";

const goalApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createGoal: builder.mutation({
      query: (data) => ({
        url: `${GOAL_URL}/createGoal`,
        method: "POST",
        body: data,
      }),
    }),
    getAll: builder.query({
      query: () => ({
        url: `${GOAL_URL}/allGoals`,
        method: "GET",
      }),
    }),
    deleteGoal: builder.mutation({
      query: (id) => ({
        url: `${GOAL_URL}/deleteGoal/${id}`,
        method: "DELETE",
      }),
    }),
    completeGoal: builder.mutation({
      query: (id) => ({
        url: `${GOAL_URL}/completeGoal/${id}`,
        method: "POST",
      }),
    }),
    getComplete: builder.query({
      query: () => ({
        url: `${GOAL_URL}/completedGoal`,
        method: "GET",
      }),
    }),
    startGoal: builder.mutation({
      query: (id) => ({
        url: `${GOAL_URL}/startGoal/${id}`,
        method: "POST",
      }),
    }),
    pauseGoal: builder.mutation({
      query: (id) => ({
        url: `${GOAL_URL}/pauseGoal/${id}`,
        method: "POST",
      }),
    }),
    resumeGoal: builder.mutation({
      query: (id) => ({
        url: `${GOAL_URL}/resumeGoal/${id}`,
        method: "POST",
      }),
    }),
    singleGoal:builder.query({
      query:({goalId})=>({
        url:`${GOAL_URL}/singeGoal/${goalId}`,
        method:"GET"
      })
    }),
    editGoal:builder.mutation({
      query:({data,id})=>({
        url:`${GOAL_URL}/updateGoal/${id}`,
        method:"PUT",
        body:data
      })
    })
  }),
});

export const {
  useCreateGoalMutation,
  useGetAllQuery,
  useDeleteGoalMutation,
  useCompleteGoalMutation,
  useGetCompleteQuery,
  useStartGoalMutation,
  usePauseGoalMutation,
  useResumeGoalMutation,
  useSingleGoalQuery,
  useEditGoalMutation
} = goalApiSlice;
