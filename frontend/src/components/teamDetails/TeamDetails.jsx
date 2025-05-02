import React, { useEffect, useState } from "react";
import "./teamDetails.css";
import { useParams } from "react-router-dom";
import moment from "moment";

import { CreateTeamtask } from "../createTeamtask/CreateTeamtask";

import { useGetAssignedMembersQuery } from "../../redux/api/assignTaskApiSlice";
import { useGetTeamtaskQuery } from "../../redux/api/teamTaskApiSlice";

export function TeamDetails() {
  const param = useParams();
  const [add, setAdd] = useState(null);


  const {refetch:teamtaskRefetch,data:teamTasks}=useGetTeamtaskQuery({teamId:param.id})
  const {refetch,data:MemberAssigned}=useGetAssignedMembersQuery({teamId:param.id})
  // const { refetch2, data, isLoading } = useGetTeamTaskQuery({
  //   teamId: param.id,
  // });

  const HandleAddTeamTask = (teamid) => {
    setAdd(teamid);
  };

  useEffect(() => {
    refetch()
    teamtaskRefetch()
    console.log(teamTasks)
  }, [refetch, add,teamtaskRefetch]);


  return (
    <section className="TeamDetailsMainSec">
      <div className="TopOfTeamDetailsDiv">
        <p className="title">Teamtasks</p>
        {teamTasks?.isAdmin?<button onClick={()=>HandleAddTeamTask(MemberAssigned?.teamIdentification)} className="text">Create Teamtask</button>:null}
      </div>
      <div>
        {
          teamTasks?.teamTasks?.length ===0?
          <div className="NoTeamTaskJustMembersDiv">
            <p className="NoTeamTaskMemberTitle title">Members</p>
            {
              teamTasks?.members.map((member)=>(
                <div key={member._id} className="EachMemberDivWrapperNoTtask">
                  <p className="EachMemberNameNoTtask text">{member.firstName} {member.lastName}( <span>{member.email}</span>)</p>
                </div>
              ))
            }
            <div className="NoTeamTaskMessageDiv">
              <p className="text">There are no Teamtasks set yet</p>
            </div>
          </div>:
          teamTasks?.teamTasks?.length !==0 ? <div className="AllTeamtaskWithDetailsDivWrapper">
            {teamTasks?.teamTasks?.map((each)=>(
              <div key={each._id} className="EachTeamtaskWithDetailsDiv">
                <div className="EachteamTaskNameDueDateDiv">
                <p className="EachteamTaskTitle text">{each.name}</p>
                <p className="EachteamtaskDueDate text">Due date:<span>{moment(each.dueDate).format("MMMM Do YYYY")}</span></p>
                </div>
                <p className="EachteamTaskDesc text">{each.description}</p>
                {
                  teamTasks?.isAdmin?
                <div className="InputDivForAssigningTask">
                  {
                    teamTasks?.members?.map((member)=>(
                      <div key={member._id}>
                        <p>{member.firstName} {member.lastName}( <span>{member.email}</span>)</p>
              
                        <input type="text" placeholder={"Assign "+member.firstName+" a task..."} />
                      </div>
                    ))
                  }
                </div>:null}
              </div>
            ))}
          </div>:null
          // MemberAssigned && MemberAssigned.data && MemberAssigned.data.length!==0?
          // MemberAssigned && MemberAssigned.data && MemberAssigned.data.map((member)=>(
          //   <div key={member._id}>
          //     <div>
          //       <p>{member.teamtask.name}</p>
          //       <p>{moment(member.teamtask.dueDate).format("MMMM Do YYYY")}</p>
          //     </div>
          //     <p>{member.teamtask.description}</p>
          //     <div>
          //       <p>Members</p>
          //       <p>{member.member.firstName} {member.member.lastName} {member.member.email}</p>
          //       <p>{member.name}</p>
          //       {
          //         MemberAssigned.isAdmin?<input type="text" />:null
          //       }
          //     </div>
          //   </div>
          // ))
}
      </div>
      {
        add!==null?<div className="OverflowAddMainDiv">
          <CreateTeamtask add={add} setAdd={setAdd}/>
        </div>:null
      }
    </section>
  );
}
