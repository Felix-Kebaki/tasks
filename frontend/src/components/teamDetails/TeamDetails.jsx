import React, { useEffect, useState } from "react";
import "./teamDetails.css";
import { useParams, Link } from "react-router-dom";
import moment from "moment";

import { CreateTeamtask } from "../createTeamtask/CreateTeamtask";
import { EachAssignedTeamtask } from "../eachAssignedTeamtask/EachAssignedTeamtask";
import { TeamConfirm } from "../confirm/TeamConfirm";
import { Invite } from "../inviteMember/Invite";
import { ViewAssets } from "../viewAssets/ViewAssets";
import { EditTeamtask } from "../EditTeamtask/EditTeamtask";
import { Loading } from "../loading/Loading";

import { useToast } from "../../context/ToastContext";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";

import { useAssignTaskMutation } from "../../redux/api/assignTaskApiSlice";
import { useGetTeamtaskQuery } from "../../redux/api/teamTaskApiSlice";

export function TeamDetails() {
  const param = useParams();
  const [add, setAdd] = useState(null);
  const [assignedTask, setAssignedTask] = useState({});
  const [reload, setReload] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [invite, setInvite] = useState(null);
  const [editTeamtask, setEditTeamtask] = useState(null);

  const [confirm, setConfirm] = useState(null);
  const [msg, setMsg] = useState("");
  const [view, setView] = useState(null);
  const [delTeam,setDelTeam]=useState(null)

  const { showToast } = useToast();

  const {
    refetch: teamtaskRefetch,
    data: teamTasks,
    isLoading,
  } = useGetTeamtaskQuery({
    teamId: param.id,
  });
  const [assignTask] = useAssignTaskMutation();

  const HandleTeamMenuEnter = () => {
    document
      .querySelector(".TeamMainAppearingMenu")
      .classList.add("TeamMainAppearMenu");
  };

  const HandleTeamMenuLeave = () => {
    document
      .querySelector(".TeamMainAppearingMenu")
      .classList.remove("TeamMainAppearMenu");
  };

  const HandleAddTeamTask = (teamid) => {
    setAdd(teamid);
  };

  const HandleClickOnDeleteTeam=(id)=>{
    setDelTeam(id)
    setMsg("Are you sure you want the team and all it's data to be deleted")
  }

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
          showToast(res.error.data?.error || res.error.error, "error");
        } else {
          showToast(res.data.message, "success");
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
      console.error(error.message || error);
      showToast(error.message || error, "error");
    }
  };

  const HandleDeleteTeamtask = async (teamtaskId) => {
    setMsg("Are you sure you want the Teamtask deleted with all of it's data");
    setConfirm(teamtaskId);
  };

  const HandleEditTeamtask = (teamtaskId) => {
    setEditTeamtask(teamtaskId);
  };

  const HandleClickOnInvite = (id) => {
    setInvite(id);
  };

  const HandleClickOnImg = (url) => {
    setView(url);
  };

  useEffect(() => {
    teamtaskRefetch();
  }, [add, teamtaskRefetch, confirm, invite, editTeamtask]);

  if (isLoading) {
    return (
      <div className="MainLoaderDiv">
        <Loading />
      </div>
    );
  }

  return (
    <section className="TeamDetailsMainSec">
      <div className="TopOfTeamDetailsDiv">
        <p className="title">Teamtasks</p>
        {teamTasks?.isAdmin ? (
          <ul
            className="TeamMainMenuAndIcon"
            onMouseEnter={HandleTeamMenuEnter}
            onMouseLeave={HandleTeamMenuLeave}
          >
            <FontAwesomeIcon
              icon={faEllipsisVertical}
              className="TeamMainMenuIconForMenuIcon"
            />
            <div className="TeamMainAppearingMenu">
              <p
                onClick={() => HandleAddTeamTask(teamTasks?.team)}
                className="text"
              >
                {" "}
                <FontAwesomeIcon
                  icon={faPlus}
                  className="EachteamSubmenuIcons"
                />
                Create Teamtask
              </p>
              <p
                className="text"
                onClick={() => HandleClickOnInvite(teamTasks?.team)}
              >
                {" "}
                <FontAwesomeIcon
                  icon={faUserPlus}
                  className="EachteamSubmenuIcons"
                />
                Invite member
              </p>
              <p
                className="text"
                onClick={() => HandleClickOnDeleteTeam(teamTasks?.team)}
              >
                {" "}
                <FontAwesomeIcon
                  icon={faTrashCan}
                  className="EachteamSubmenuIcons"
                />
                Delete
              </p>
            </div>
          </ul>
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
                  <div className="EachteamTaskTitleAndIconDiv">
                    <p className="EachteamTaskTitle text">{each.name}</p>
                    <ul
                      className="EachteamTaskSubMenuDivWrapperSecond"
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    >
                      <FontAwesomeIcon icon={faEllipsisVertical} />
                      {hoveredIndex === index && (
                        <div className="EachteamTaskSubMenuDiv text">
                          <Link
                            to={
                              "/app/teams/eachTeamtask/submissions/" + each._id
                            }
                          >
                            <FontAwesomeIcon
                              icon={faLink}
                              className="EachteamTaskSubmenuIcons"
                            />
                            Submissions
                          </Link>
                          {teamTasks.isAdmin ? (
                            <>
                              <p onClick={() => HandleEditTeamtask(each._id)}>
                                <FontAwesomeIcon
                                  icon={faPenToSquare}
                                  className="EachteamTaskSubmenuIcons"
                                />
                                Edit
                              </p>
                              <p onClick={() => HandleDeleteTeamtask(each._id)}>
                                <FontAwesomeIcon
                                  icon={faTrashCan}
                                  className="EachteamTaskSubmenuIcons"
                                />
                                Delete
                              </p>
                            </>
                          ) : null}
                        </div>
                      )}
                    </ul>
                  </div>
                  <div className="EachteamTaskTimeAndEachSubmenuDiv">
                    {each.outOfTime ? (
                      <p className="EachteamTaskOutOfTimeMsg text">
                        Out of time
                      </p>
                    ) : (
                      <p className="EachteamtaskDueDate text">
                        Due date:
                        <span>
                          {moment(each.dueDate).format("MMM Do YYYY")}
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
                          <Link
                            to={
                              "/app/teams/eachTeamtask/submissions/" + each._id
                            }
                          >
                            <FontAwesomeIcon
                              icon={faLink}
                              className="EachteamTaskSubmenuIcons"
                            />
                            Submissions
                          </Link>
                          {teamTasks.isAdmin ? (
                            <>
                              <p onClick={() => HandleEditTeamtask(each._id)}>
                                <FontAwesomeIcon
                                  icon={faPenToSquare}
                                  className="EachteamTaskSubmenuIcons"
                                />
                                Edit
                              </p>
                              <p onClick={() => HandleDeleteTeamtask(each._id)}>
                                <FontAwesomeIcon
                                  icon={faTrashCan}
                                  className="EachteamTaskSubmenuIcons"
                                />
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
                {each.fileType !== "None" && each.fileType === "Link" ? (
                  <div className="EachTeamtaskResourceDiv">
                    <a
                      className="text"
                      href={each.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Visit resource link{" "}
                      <FontAwesomeIcon
                        icon={faArrowUpRightFromSquare}
                        className="VisitLinkIcon"
                      />
                    </a>
                  </div>
                ) : each.fileType !== "None" && each.fileType === "Photo" ? (
                  <div className="EachTeamtaskImgResourceDiv">
                    <img
                      src={each.fileUrl}
                      alt="Img"
                      onClick={() => HandleClickOnImg(each.fileUrl)}
                    />
                    <div className="text">Resource as an image</div>
                  </div>
                ) : each.fileType !== "None" && each.fileType === "Document" ? (
                  <div className="EachTeamtaskResourceDiv">
                    <a
                      className="text"
                      href={each.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Document{" "}
                      <FontAwesomeIcon
                        icon={faArrowUpRightFromSquare}
                        className="VisitLinkIcon"
                      />
                    </a>
                  </div>
                ) : null}
                <div className="ProgressBarMainOuterDiv">
                  <p className="text">
                    {each.completedOnes !== 0
                      ? `Progress:${Math.floor(
                          (each.completedOnes / each.allAssigned) * 100
                        )}%`
                      : "No progress"}
                  </p>
                  <div className="ProgressBarMainDiv">
                    <div
                      className="ProgressBackgroundShowing"
                      style={{
                        width:
                          each.completedOnes === 0
                            ? "0%"
                            : `${
                                (each.completedOnes / each.allAssigned) * 100
                              }%`,
                      }}
                    ></div>
                  </div>
                </div>
                <div className="InputDivForAssigningTask">
                  <p className="InputDivForAssigningTaskTitleMembers text">
                    Members
                  </p>
                  <div className="AllAssignedTeamtaskTeamDetailsWrapper">
                    {teamTasks?.members?.map((member, index) => (
                      <div key={member._id}>
                        <p className="AllAssignedTeamtaskMembersName text">
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
      {confirm !== null ? (
        <div className="OverflowAddMainDiv">
          <TeamConfirm
            setMsg={setMsg}
            msg={msg}
            confirm={confirm}
            setConfirm={setConfirm}
          />
        </div>
      ) : null}
      {invite !== null ? (
        <div className="OverflowAddMainDiv">
          <Invite invite={invite} setInvite={setInvite} />
        </div>
      ) : null}
      {view !== null ? (
        <div className="OverflowAddMainDiv">
          <ViewAssets setView={setView} view={view} />
        </div>
      ) : null}
      {editTeamtask !== null ? (
        <div className="OverflowAddMainDiv">
          <EditTeamtask
            editTeamtask={editTeamtask}
            setEditTeamtask={setEditTeamtask}
          />
        </div>
      ) : null}
      {
        delTeam!==null?(
          <div className="OverflowAddMainDiv">
            <TeamConfirm setMsg={setMsg} msg={msg} confirm={delTeam} setConfirm={setDelTeam}/>
          </div>
        ):null
      }
    </section>
  );
}
