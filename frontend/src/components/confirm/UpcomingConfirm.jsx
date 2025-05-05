import React from 'react'
import './confirm.css'

import { useDeleteUpcomingMutation } from '../../redux/api/upcomingApiSlice'

export function UpcomingConfirm({setConfirm,confirm}) {

    const [deleteUpcoming]=useDeleteUpcomingMutation()

    const HandleDeleteUpcoming=async()=>{
        try {
            const res=await deleteUpcoming({date:confirm})
            if(res.error){
                console.error(res.error.data.error || res.error.error)
            }else{
                console.log(res.data.message)
                setConfirm(null)
            }
        } catch (error) {
            console.error(error.message)
        }
    }

    const Cancel=()=>{
        setConfirm(null)
    }
  return (
    <section className="ConfirmMainSec">
      <div className="ConfirmMainDiv">
        <p className="ConfirmationMainTitle title">Confirmation</p>
        <p className="ConfirmationMainDesc text">Are you sure you want to delete all the events on this date?</p>
        <div>
          <button
            onClick={HandleDeleteUpcoming}
          >
            confirm
          </button>
          <button onClick={Cancel}>cancel</button>
        </div>
      </div>
    </section>
  )
}
