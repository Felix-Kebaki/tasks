import React from "react";
import { useDeleteGoalMutation } from "../../redux/api/goalApiSlice";
import { useCompleteGoalMutation } from "../../redux/api/goalApiSlice";
import { useMarkDoneMutation } from "../../redux/api/todayApiSlice";
import { useDeleteObjectiveMutation } from "../../redux/api/todayApiSlice";
import "./confirm.css";

import { useToast } from "../../context/ToastContext";

export function ObjectiveConfirm({ setConfirm, confirm, setMsg, msg }) {
  const [deleteGoal] = useDeleteGoalMutation();
  const [completeGoal] = useCompleteGoalMutation();
  const [markDone]=useMarkDoneMutation()
  const [deleteObjective] =useDeleteObjectiveMutation()
  const Cancel = () => {
    setConfirm(null);
    setMsg("");
  };

  const {showToast}=useToast()

  const ConfirmDelete = async () => {
    try {
      const response = await deleteGoal(confirm);
      if (response.error) {
        console.log(response.error.data.error || response.error.error);
        showToast(response.error.data.error || response.error.error,"error")
      } else {
        showToast(response.data.message,"success");
        setConfirm(null);
        setMsg("");
      }
    } catch (error) {
      console.error("Error in deleting from frontend", error.message);
      showToast(error.message || error,"error")
    }
  };

  const ConfirmMarkDone = async () => {
    try {
      const response = await completeGoal(confirm);
      if (response.error) {
        console.error(response.error.data.error || response.error.error);
        showToast(response.error.data.error || response.error.error,"error")
      } else {
        showToast(response.data.message,"success");
        setConfirm(null);
        setMsg("");
      }
    } catch (error) {
      console.error("Error in marking done at frontend", error.message);
      showToast(error.message|| error,"error")
    }
  };

  const ConfirmMarkObjDone = async () => {
    try {
        const response=await markDone(confirm)
        if (response.error) {
            console.error(response.error.data.error || response.error.error);
            showToast(response.error.data.error || response.error.error,"error")
          } else {
            showToast(response.data.message,"success");
            setConfirm(null);
            setMsg("");
          }
    } catch (error) {
      console.error("Error in marking done at frontend", error.message);
      showToast(error.message||error,"error")
    }
  };

  const ConfirmDeleteObjective=async()=>{
    try {
        const response=await deleteObjective(confirm)
        if (response.error) {
            console.error(response.error.data.error || response.error.error);
            showToast(response.error.data.error || response.error.error,"error")
          } else {
            showToast(response.data.message,"success");
            setConfirm(null);
            setMsg("");
          }
    } catch (error) {
      console.error("Error in marking done at frontend", error.message);
      showToast(error.message||error,"error")
    }
  }


  return (
    <section className="ConfirmMainSec">
      <div className="ConfirmMainDiv">
        <p className="ConfirmationMainTitle title">Confirmation</p>
        <p className="ConfirmationMainDesc text">The objective will be {msg}</p>
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
                :  null
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
