import React, { useState } from 'react'
import './createTeamtask.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faXmark} from '@fortawesome/free-solid-svg-icons'

import { useCreateTeamtaskMutation } from '../../redux/api/teamTaskApiSlice'

export function CreateTeamtask({setAdd,add}) {
    const [data,setData]=useState({
        name:"",description:"",dueDate:""
    })
    const {name,description,dueDate}=data

    const OnChange=(e)=>{
        setData((prev)=>({
            ...prev,[e.target.name]:e.target.value
        }))
    }

    const [createTeamtask]=useCreateTeamtaskMutation()

    const HandleSubmitTeamtask=async(e)=>{
        e.preventDefault()
        try {
            const res=await createTeamtask({data,teamId:add})
            if(res.error){
                console.error(res.error.data.error || res.error.error)
            }else{
                console.log(res.data.message)
                setAdd(null)
            }
        } catch (error) {
            console.error(error.message)
        }
    }

  return (
    <section className='CreateTeamtaskMainSec'>
        <form className="CreateTeamtaskForm" onSubmit={HandleSubmitTeamtask}>
            <div className='CreateTeamtaskTopDiv'>
              <p className="CreateTeamtaskTitle title">Create a Teamtask</p>
              <FontAwesomeIcon
                icon={faXmark}
                onClick={() => setAdd(null)}
                className="CloseAddTeamtaskIcon"
              />
            </div>
            <p className='CreateTeamtaskDesc text'>After creating a team, you can assign specific tasks to individual members, streamlining teamwork and boosting productivity</p>
            <div className='TeamtaskActualFormDiv'>
                <div className='InputOfTeamtask'>
                    <label htmlFor="teamtasknameId" className='text'>Teamtask name</label><br/>
                    <input type="text" id="teamtasknameId" value={name} name='name' onChange={OnChange} className='text'/>
                </div>
                <div className='InputOfTeamtask'>
                    <label htmlFor="teamtaskdescId" className='text'>Teamtask description</label><br/>
                    <input type="text" id="teamtaskdescId" value={description} name='description' onChange={OnChange} className='text'/>
                </div>
                <div className='InputOfTeamtask'>
                    <label htmlFor="dueDateId" className='text'>Due date</label>
                    <input type="date" value={dueDate} name='dueDate' onChange={OnChange} className='text' id='dueDateId' />
                </div>
                <div className='CreateTeamtaskButtonDiv'>
                    <input type="submit" value={"Create"} className='CreateTeamtaskButton text'/>
                </div>
            </div>
        </form>
    </section>
  )
}
