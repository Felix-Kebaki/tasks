import React, { useState } from "react";
import "./invite.css";

import { useSendInviteMutation } from "../../redux/api/invitesApiSlice";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faXmark} from '@fortawesome/free-solid-svg-icons'

export function Invite({invite,setInvite}) {
    const [email,setEmail]=useState("")
    const [sendInvite]=useSendInviteMutation()
  const HandleSubmitInvite =async (e) => {
    e.preventDefault();
    try {
        const res=await sendInvite({data:{email},teamId:invite})
        if(res.error){
            console.error(res.error.data.error || res.error.error)
        }else{
            console.log(res.data.message)
            setInvite(null)
        }
    } catch (error) {
        console.error(error.message)
    }
  };

  const CloseInviteForm=()=>{
    setInvite(null)
  }

  return (
    <section className="InviteMainSec">
      <form onSubmit={HandleSubmitInvite} className="InviteMainForm">
        <div className="TopInviteMainDiv">
            <p className="TopInviteMainTitle title">Enter the user's email you intend to invite</p>
            <FontAwesomeIcon icon={faXmark} onClick={CloseInviteForm} className="InviteFormCloseIcon"/>
        </div>
        <div className="InviteInputEmailDiv">
            <label htmlFor="inviteEmailId" className="text">Email address</label><br/>
            <input type="text" value={email} onChange={(e)=>setEmail(e.target.value)} id="inviteEmailId" className="text" />
        </div>
        <div className="InviteFormSubmitMainDiv">
            <input type="submit" value={"Invite"} />
        </div>
      </form>
    </section>
  );
}
