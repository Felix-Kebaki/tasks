import React, { useEffect } from "react";
import "./eachAssignedTeamtask.css"

import { useGetTeamAssignedTaskQuery } from "../../redux/api/assignTaskApiSlice";
import { useDeleteAssignedTaskMutation } from "../../redux/api/assignTaskApiSlice";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faTrashCan} from '@fortawesome/free-solid-svg-icons'

export function EachAssignedTeamtask({ taskId, userId ,reload,isAdmin}) {
  const { refetch, data, isLoading } = useGetTeamAssignedTaskQuery({
    taskId,
    userId,
  });
  const [deleteAssignedTask]=useDeleteAssignedTaskMutation()

  const HandleDeleteAssignedTask=async(assignedId)=>{
    try {
      const res=await deleteAssignedTask({taskId:assignedId})
      if(res.error){
        console.error(res.error.data.error || res.error.error)
      }else{
        console.log(res.data.message)
        refetch()
      }
    } catch (error) {
      console.error(error.message)
    }
  }

  useEffect(() => {
    refetch();
  }, [refetch,reload]);
  return (
    <section className="EachAssignedTeamtaskMainSec">
      {data?.length !== 0 ? (
        <div className="AssignedTeamTaskMainDiv">
        {
            data?.map((data)=>(
                <div key={data._id}>
                    <p className="EachAssignedTeamtaskMainName text">{data.name}</p>
                    <div className="EAchAssignedTeamtaskDeleteAndStatusDiv">
                    {isAdmin && (data.status !=="Completed" && data.status !=="In progress")?<FontAwesomeIcon icon={faTrashCan} onClick={()=>HandleDeleteAssignedTask(data._id)} id="DeleteAssignedTaskIcon"/>:null}
                    <p className={data.status==="Not started"?"statusOfAssignedNotStartedTask text":data.status==="In progress"?"statusOfAssignedInProgressTask text":"statusOfAssignedCompletedTask text"}>{data.status}</p>
                    </div>
                </div>
            ))
        }
        </div>
      ) : (
        <div className="EachAssignedTeamtaskNotAssignedDiv">
            <p className="text">Not assigned any task yet</p>
        </div>
      )}
    </section>
  );
}
