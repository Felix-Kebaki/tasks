import { createSlice } from "@reduxjs/toolkit";

const initialState={
    userInfo:localStorage.getItem("userInfo")?JSON.parse(localStorage.getItem("userInfo")):null
}

const authSlice=createSlice({
    name:"auth",
    initialState,
    reducers:{
        setCredentials:(state,action)=>{
            state.userInfo=action.payload
            localStorage.setItem("userInfo",JSON.stringify(action.payload))
            const expirationDate=new Date().getTime()*1*24*60*60*1000
            localStorage.setItem("expirationDate",expirationDate)
        },
        logoutS:(state)=>{
            state.userInfo=null
            localStorage.clear()
        }
    }
})

export const {setCredentials,logoutS}=authSlice.actions

export default authSlice.reducer