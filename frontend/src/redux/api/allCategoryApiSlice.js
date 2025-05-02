import { CATEGORY_URL } from "../constants";
import { apiSlice } from "./apiSlice";

const categoryApiSlice=apiSlice.injectEndpoints({
    endpoints:(builder)=>({
        getCategory:builder.query({
            query:()=>({
                url:`${CATEGORY_URL}/getAllCategory`,
                method:"GET"
            })
        })
    })
})

export const {useGetCategoryQuery}=categoryApiSlice