import { UPCOMING_URL } from "../constants";
import {apiSlice} from '../api/apiSlice'

const upcomingApiSlice=apiSlice.injectEndpoints({
    endpoints:(builder)=>({
        getUpcomings:builder.query({
            query:({year,month})=>({
                url:`${UPCOMING_URL}/getUpcoming/${year}/${month}`,
                method:"GET"
            })
        }),
        createEvent:builder.mutation({
            query:(data)=>({
                url:`${UPCOMING_URL}/createUpcoming`,
                method:"POST",
                body:data
            })
        })
    })
})

export const {useGetUpcomingsQuery,useCreateEventMutation}=upcomingApiSlice