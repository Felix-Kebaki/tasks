import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'


export function TeamSubmissions() {
    const param=useParams()
    useEffect(()=>{
        console.log(param.teamtaskId)
    },[])
  return (
    <div style={{background:"red"}}>TeamSubmissions</div>
  )
}
