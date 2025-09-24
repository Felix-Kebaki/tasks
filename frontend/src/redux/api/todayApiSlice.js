import { apiSlice } from "./apiSlice";
import { TODAY_URL,DAILYREPORT_URL } from "../constants";


const todayApiSlice=apiSlice.injectEndpoints({
    endpoints:(builder)=>({
        createObjective:builder.mutation({
            query:(data)=>({
                url:`${TODAY_URL}/createObjective`,
                method:"POST",
                body:data
            })
        }),
        getObjectives:builder.query({
            query:()=>({
                url:`${TODAY_URL}/getObjective`,
                method:"GET"
            })
        }),
        markDone:builder.mutation({
            query:(id)=>({
                url:`${TODAY_URL}/objectiveDone/${id}`,
                method:"POST"
            })
        }),
        deleteObjective:builder.mutation({
            query:(id)=>({
                url:`${TODAY_URL}/deleteObjective/${id}`,
                method:"DELETE"
            })
        }),
        dailyReport:builder.query({
            query:()=>({
                url:`${DAILYREPORT_URL}/getDailyReport`,
                method:"GET"
            })
        })
    })
})

export const {useCreateObjectiveMutation, useMarkDoneMutation,useGetObjectivesQuery,useDeleteObjectiveMutation,useDailyReportQuery}=todayApiSlice