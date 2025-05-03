import React, { useEffect, useState } from "react";
import "./teamDetails.css";
import { useParams, Link } from "react-router-dom";
import moment from "moment";

import { CreateTeamtask } from "../createTeamtask/CreateTeamtask";
import { EachAssignedTeamtask } from "../eachAssignedTeamtask/EachAssignedTeamtask";
import { TeamConfirm } from "../confirm/TeamConfirm";
import { Invite } from "../inviteMember/Invite";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";

import { useGetTeamtaskQuery } from "../../redux/api/teamTaskApiSlice";
import { useAssignTaskMutation } from "../../redux/api/assignTaskApiSlice";

export function TeamDetails() {
  const param = useParams();
  const [add, setAdd] = useState(null);
  const [assignedTask, setAssignedTask] = useState({});
  const [reload, setReload] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [invite,setInvite]=useState(null)

  const [confirm,setConfirm]=useState(null)
  const [msg,setMsg]=useState("")

  const { refetch: teamtaskRefetch, data: teamTasks } = useGetTeamtaskQuery({
    teamId: param.id,
  });
  // const { refetch, data: MemberAssigned } = useGetAssignedMembersQuery({
  //   teamId: param.id,
  // });
  const [assignTask] = useAssignTaskMutation();
  // const { refetch2, data, isLoading } = useGetTeamTaskQuery({
  //   teamId: param.id,
  // });

  const HandleAddTeamTask = (teamid) => {
    setAdd(teamid);
  };

  const OnChangeAssignedTask = (taskId, memberId, value) => {
    setAssignedTask((prev) => ({
      ...prev,
      [taskId]: {
        ...prev[taskId],
        [memberId]: value,
      },
    }));
  };

  const HandleAssignMemberTask = async (teamId, taskId, userId) => {
    try {
      const taskText = assignedTask?.[taskId]?.[userId]?.trim();
      if (taskText) {
        const res = await assignTask({
          teamId,
          teamTaskId: taskId,
          userId,
          data: { name: taskText },
        });
        if (res.error) {
          console.error(res.error.data?.error || res.error.error);
        } else {
          console.log(res.data.message);
          teamtaskRefetch();
          setAssignedTask((prev) => ({
            ...prev,
            [taskId]: {
              ...prev[taskId],
              [userId]: "",
            },
          }));
          setReload(!reload);
        }
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const HandleDeleteTeamtask = async (teamtaskId) => {
    setMsg("Are you sure you want the Teamtask deleted with all of it's data")
    setConfirm(teamtaskId)
  };

  const HandleClickOnInvite=(id)=>{
    setInvite(id)
  }

  useEffect(() => {
    teamtaskRefetch();
  }, [add, teamtaskRefetch,confirm,invite]);

  return (
    <section className="TeamDetailsMainSec">
      <div className="TopOfTeamDetailsDiv">
        <p className="title">Teamtasks</p>
        {teamTasks?.isAdmin ? (
          <button
            onClick={() => HandleAddTeamTask(teamTasks?.team)}
            className="text"
          >
            Create Teamtask
          </button>
        ) : null}
      </div>
      <div>
        {teamTasks?.teamTasks?.length === 0 ? (
          <div className="NoTeamTaskJustMembersDiv">
            <p className="NoTeamTaskMemberTitle title">Members</p>
            {teamTasks?.members.map((member) => (
              <div key={member._id} className="EachMemberDivWrapperNoTtask">
                <p className="EachMemberNameNoTtask text">
                  {member.firstName} {member.lastName}
                </p>
              </div>
            ))}
            <div className="NoTeamTaskMessageDiv">
              <p className="text">There are no Teamtasks set yet</p>
            </div>
          </div>
        ) : teamTasks?.teamTasks?.length !== 0 ? (
          <div className="AllTeamtaskWithDetailsDivWrapper">
            {teamTasks?.teamTasks?.map((each, index) => (
              <div key={each._id} className="EachTeamtaskWithDetailsDiv">
                <div className="EachteamTaskNameDueDateDiv">
                  <p className="EachteamTaskTitle text">{each.name}</p>

                  <div className="EachteamTaskTimeAndEachSubmenuDiv">
                    {each.outOfTime ? (
                      <p className="EachteamTaskOutOfTimeMsg text">
                        Out of time
                      </p>
                    ) : (
                      <p className="EachteamtaskDueDate text">
                        Due date:
                        <span>
                          {moment(each.dueDate).format("MMMM Do YYYY")}
                        </span>
                      </p>
                    )}
                    <ul
                      className="EachteamTaskSubMenuDivWrapper"
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    >
                      <FontAwesomeIcon icon={faEllipsisVertical} />
                      {hoveredIndex === index && (
                        <div className="EachteamTaskSubMenuDiv text">
                          <Link to={"/app/teams/eachTeamtask/submissions/" + each._id}>
                            <FontAwesomeIcon icon={faLink} className="EachteamTaskSubmenuIcons"/>
                            Submissions
                          </Link>
                          {teamTasks.isAdmin ? (
                            <>
                              <p>
                                <FontAwesomeIcon icon={faPenToSquare} className="EachteamTaskSubmenuIcons" />
                                Edit
                              </p>
                              <p onClick={()=>HandleClickOnInvite(each.team)}><FontAwesomeIcon icon={faUserPlus} className="EachteamTaskSubmenuIcons"/>
                                Invite member
                              </p>
                              <p onClick={() => HandleDeleteTeamtask(each._id)}>
                                <FontAwesomeIcon icon={faTrashCan} className="EachteamTaskSubmenuIcons"/>
                                Delete
                              </p>
                            </>
                          ) : null}
                        </div>
                      )}
                    </ul>
                  </div>
                </div>
                <p className="EachteamTaskDesc text">{each.description}</p>
                <div className="InputDivForAssigningTask">
                  <p className="InputDivForAssigningTaskTitleMembers text">
                    Members
                  </p>
                  <div className="AllAssignedTeamtaskTeamDetailsWrapper">
                    {teamTasks?.members?.map((member, index) => (
                      <div key={member._id}>
                        <p className="text">
                          {member.firstName} {member.lastName}
                        </p>
                        <EachAssignedTeamtask
                          taskId={each._id}
                          userId={member._id}
                          reload={reload}
                          isAdmin={teamTasks.isAdmin}
                        />
                        {teamTasks?.isAdmin ? (
                          <div className="AssignTeamtaskInputMainDiv">
                            <input
                              type="text"
                              placeholder={
                                "Assign " + member.firstName + " a task..."
                              }
                              value={assignedTask[each._id]?.[member._id] || ""}
                              onChange={(e) =>
                                OnChangeAssignedTask(
                                  each._id,
                                  member._id,
                                  e.target.value
                                )
                              }
                            />
                            <button
                              onClick={() =>
                                HandleAssignMemberTask(
                                  teamTasks.team,
                                  each._id,
                                  member._id
                                )
                              }
                            >
                              Assign
                            </button>
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
      {add !== null ? (
        <div className="OverflowAddMainDiv">
          <CreateTeamtask add={add} setAdd={setAdd} />
        </div>
      ) : null}
      {
        confirm !==null?
        <div className="OverflowAddMainDiv">
          <TeamConfirm setMsg={setMsg} msg={msg} confirm={confirm} setConfirm={setConfirm}/>
        </div>
        :null
      }{
        invite !==null?
        <div className="OverflowAddMainDiv">
          <Invite invite={invite} setInvite={setInvite}/>
        </div>:null
      }
    </section>
  );
}
