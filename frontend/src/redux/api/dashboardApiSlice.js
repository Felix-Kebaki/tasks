import {apiSlice} from '../api/apiSlice'
import { DASHBOARD_URL } from '../constants'

const dashboardApiSlice=apiSlice.injectEndpoints({
    endpoints:(builder)=>({
        asPerStatus:builder.query({
            query:()=>({
                url:`${DASHBOARD_URL}/getPerStatus`,
                method:"GET"
            })
        }),
        asPerPriority:builder.query({
            query:()=>({
                url:`${DASHBOARD_URL}/getPerPriority`,
                method:"GET"
            })
        }),
        getEachLength:builder.query({
            query:()=>({
                url:`${DASHBOARD_URL}/getEachLength`,
                method:"GET"
            })
        }),
        getMonthlyUsage:builder.query({
            query:()=>({
                url:`${DASHBOARD_URL}/getMonthlyUsage`,
                method:"GET"
            })
        })
    })
})

export const {useAsPerPriorityQuery,useAsPerStatusQuery,useGetEachLengthQuery,useGetMonthlyUsageQuery}=dashboardApiSlice