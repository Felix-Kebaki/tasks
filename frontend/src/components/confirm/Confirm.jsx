import React from "react";
import { useDeleteGoalMutation } from "../../redux/api/goalApiSlice";
import { useCompleteGoalMutation } from "../../redux/api/goalApiSlice";
import { useMarkDoneMutation } from "../../redux/api/todayApiSlice";
import { useDeleteObjectiveMutation } from "../../redux/api/todayApiSlice";
import "./confirm.css";

export function Confirm({ setConfirm, confirm, setMsg, msg }) {
  const [deleteGoal] = useDeleteGoalMutation();
  const [completeGoal] = useCompleteGoalMutation();
  const [markDone]=useMarkDoneMutation()
  const [deleteObjective] =useDeleteObjectiveMutation()
  const Cancel = () => {
    setConfirm(null);
    setMsg("");
  };

  const ConfirmDelete = async () => {
    try {
      const response = await deleteGoal(confirm);
      if (response.error) {
        console.log(response.error.data.error || response.error.error);
      } else {
        console.log(response.data.message);
        setConfirm(null);
        setMsg("");
      }
    } catch (error) {
      console.error("Error in deleting from frontend", error.message);
    }
  };

  const ConfirmMarkDone = async () => {
    try {
      const response = await completeGoal(confirm);
      if (response.error) {
        console.error(response.error.data.error || response.error.error);
      } else {
        console.log(response.data.message);
        setConfirm(null);
        setMsg("");
      }
    } catch (error) {
      console.error("Error in marking done at frontend", error.message);
    }
  };

  const ConfirmMarkObjDone = async () => {
    try {
        const response=await markDone(confirm)
        if (response.error) {
            console.error(response.error.data.error || response.error.error);
          } else {
            console.log(response.data.message);
            setConfirm(null);
            setMsg("");
          }
    } catch (error) {
      console.error("Error in marking done at frontend", error.message);
    }
  };

  const ConfirmDeleteObjective=async()=>{
    try {
        const response=await deleteObjective(confirm)
        if (response.error) {
            console.error(response.error.data.error || response.error.error);
          } else {
            console.log(response.data.message);
            setConfirm(null);
            setMsg("");
          }
    } catch (error) {
      console.error("Error in marking done at frontend", error.message);
    }
  }

  const ConfirmDeleteTeam=async()=>{
    
  }

  return (
    <section className="ConfirmMainSec">
      <div className="ConfirmMainDiv">
        <p>The objective will be {msg}</p>
        <div>
          <button
            onClick={
              msg === "deleted"
                ? ConfirmDelete
                : msg === "marked as complete"
                ? ConfirmMarkDone
                : msg === "marked as done"
                ? ConfirmMarkObjDone
                : msg ==="removed"
                ?ConfirmDeleteObjective
                : msg ==="removed"
                ?ConfirmDeleteTeam: null
            }
          >
            confirm
          </button>
          <button onClick={Cancel}>cancel</button>
        </div>
      </div>
    </section>
  );
}
