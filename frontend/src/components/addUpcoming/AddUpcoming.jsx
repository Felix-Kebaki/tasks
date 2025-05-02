import React, { useState } from "react";
import "./addUpcoming.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import { useCreateEventMutation } from "../../redux/api/upcomingApiSlice";

export function AddUpcoming({setAdd,add}) {
    const [name,setName]=useState("")
    const [desc,setDesc]=useState("")

    const [createEvent]=useCreateEventMutation()

    const HandleSubmitUpcoming=async(e)=>{
        e.preventDefault()
        try {
            const res=await createEvent({title:name,description:desc,eventDate:add})
            if(res.error){
                console.error(res.error.data.error || res.error.error)
            }else{
                setAdd(null)
            }
        } catch (error) {
            console.error(error.message)
        }
    }

  return (
    <section className="AddUpcomingMainSec">
      <form className="AddUpcomingMainForm" onSubmit={HandleSubmitUpcoming}>
        <div className="AddUpcomingTopDiv">
          <p className="title">Add Upcoming event</p>
          <FontAwesomeIcon
            icon={faXmark}
            onClick={() => setAdd(null)}
            className="CloseAddUpcomingIcon"
          />
        </div>
        <div className="ActualUpcomintFormDiv">
            <div className="UpcomingInputDiv">
                <label htmlFor="upcomingLabel" className="text">Upcoming event</label><br/>
                <input type="text" id="upcomingLabel" className="text" value={name} onChange={(e)=>setName(e.target.value)}/>
            </div>
            <div className="UpcomingInputDiv">
                <label htmlFor="upcomingLabel" className="text">Event description</label><br/>
                <input type="text" id="upcomingLabel" className="text" value={desc} onChange={(e)=>setDesc(e.target.value)}/>
            </div>
            {/* <div className="CheckBoxUpcomingDiv">
                <input type="checkbox" id="checkboxId" className="text"/>
                <p className="text">Send me alerts to my email</p>
            </div> */}
            <div className="UpcomingCreateBtn">
            <input type="submit" value={"Create"} className="text"/>
            </div>
        </div>
      </form>
    </section>
  );
}
