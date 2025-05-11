import { CATEGORY_URL } from "../constants";
import { apiSlice } from "./apiSlice";

const categoryApiSlice=apiSlice.injectEndpoints({
    endpoints:(builder)=>({
        getCategory:builder.query({
            query:()=>({
                url:`${CATEGORY_URL}/getAllCategory`,
                method:"GET"
            })
        }),
        getAllPerCat:builder.query({
            query:({categoryName})=>({
                url:`${CATEGORY_URL}/goalAndObjectivesPerCategory/${categoryName}`,
                method:"GET"
            })
        })
    })
})

export const {useGetCategoryQuery,useGetAllPerCatQuery}=categoryApiSlice