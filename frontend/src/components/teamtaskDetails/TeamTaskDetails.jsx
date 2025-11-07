import "./teamtaskDetails.css";

import { useEffect, useState } from "react";
import moment from "moment";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useToast } from "../../context/ToastContext";

import { useGetEachTeamtaskQuery } from "../../redux/api/teamTaskApiSlice";
import { useGetAssignedMembersQuery } from "../../redux/api/assignTaskApiSlice";

import { TeamConfirm } from "../confirm/TeamConfirm";
import { EditTeamtask } from "../EditTeamtask/EditTeamtask";
import { Loading } from "../loading/Loading";
import { TeamTaskConfirm } from "../confirm/TeamTaskConfirm";
import { CreateSubtask } from "../createSubtask/CreateSubtask";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faSquareXmark } from "@fortawesome/free-solid-svg-icons";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { faSquare } from "@fortawesome/free-regular-svg-icons";
import { faSquareCheck } from "@fortawesome/free-regular-svg-icons";

export function TeamTaskDetails() {
  const { userInfo } = useSelector((state) => state.auth);
  const param = useParams();
  const { showToast } = useToast();

  const { data, refetch, isLoading } = useGetEachTeamtaskQuery(param.id);
  const {
    data: assignedWithMembers,
    refetch: assignedRefetch,
    isLoading: assignedLoading,
  } = useGetAssignedMembersQuery(data?.teamId, { skip: !data?.teamId });

  const [msg, setMsg] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [editTeamtask, setEditTeamtask] = useState(null);
  const [assignedTaskDel, setAssignedTaskDel] = useState(null);
  const [userId, setUserId] = useState(null);
  const [teamtaskId, setTeamtaskId] = useState(null);
  const [teamId, setTeamId] = useState(null);
  const [showAssign, setShowAssign] = useState(false);

  const ClickOnDeleteTeamtask = (getId) => {
    setMsg("Are you sure you want the Teamtask deleted with all of it's data");
    setConfirm(getId);
  };

  const ClickOnEditTeamtask = (Id) => {
    setEditTeamtask(Id);
  };

  const ClickOnAssignTask = (getUser) => {
    if (data?.isAdmin) {
    setUserId(getUser);
    setTeamId(data?.teamId);
    setTeamtaskId(data?.teamtaskId);
    setShowAssign(true);
    }
  };

  useEffect(() => {
    refetch();

    if (data?.teamId) {
      assignedRefetch();
    }
    console.log(data)
  }, [
    refetch,
    assignedRefetch,
    msg,
    confirm,
    editTeamtask,
    assignedTaskDel
  ]);

  if (assignedLoading || isLoading || !data || !assignedWithMembers) {
    return (
      <div className="MainLoaderDiv">
        <Loading />
      </div>
    );
  }

  return (
    <section className="TeamtaskDetailsMainSec">
      <div className="TeamtaskDetailsMainDiv">
        <div className="TeamtaskDetailsTopMainDiv">
          <div className="TeamtaskDetailsTitleAndDescDiv">
            <p className="title">{data?.name}</p>
            <p
              className={
                data?.admin !== userInfo._id
                  ? "NotAdminTeamtaskDesc text"
                  : "text"
              }
            >
              {data?.description}
            </p>
          </div>
          <div className="TeamtaskDetailsTopButtonsAndDueDateDiv">
            {data?.isAdmin ? (
              <div className="TeamtaskDetailsTopButtonsDiv text">
                <div onClick={() => ClickOnEditTeamtask(data?.teamtaskId)}>
                  <span>
                    <FontAwesomeIcon icon={faPenToSquare} />
                  </span>
                  <p>Edit</p>
                </div>
                <div onClick={() => ClickOnDeleteTeamtask(data?.teamtaskId)}>
                  <span>
                    <FontAwesomeIcon icon={faTrashCan} />
                  </span>
                  <p>Delete</p>
                </div>
              </div>
            ) : null}

            <div className="TeamtaskDetailsDueDateOnlyMainDiv">
              {data?.outOfTime ? (
                <p className="TeamtaskDetailsOutOfTimeOverall text">
                  Out of Time
                </p>
              ) : (
                <p className="TeamtaskDetailsDueDateOnly text">
                  Due: <span>{moment(data?.dueDate).format("DD MMM")}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="TeamtaskDetailsAssignedSubmissionsMainDiv">
          <div className="TeamtaskDetailsAssignedMainDiv">
            <div className="TeamtaskDetailsAssignedTitleAndLabelDiv text">
              <div className="TeamtaskDetailsAssignedTitle">
                <p>Assigned subtasks</p>
                {data?.allAssigned !== 0 ? (
                  <div>{data?.allAssigned}</div>
                ) : null}
              </div>
              <div className="TeamtaskDetailsAssignedLabelDiv">
                <p>
                  <span>
                    <FontAwesomeIcon
                      icon={faSquare}
                      className="TeamtaskDetailsAssignNotStrtLabel"
                    />
                  </span>
                  Not started
                </p>
                <p>
                  <span>
                    <FontAwesomeIcon
                      icon={faSquare}
                      className="TeamtaskDetailsAssignInProgLabel"
                    />
                  </span>
                  In progress
                </p>
                <p>
                  <span>
                    <FontAwesomeIcon
                      icon={faSquareCheck}
                      className="TeamtaskDetailsAssignCompletedLabel"
                    />
                  </span>
                  Completed
                </p>
                <p>
                  <span>
                    <FontAwesomeIcon
                      icon={faSquareXmark}
                      className="TeamtaskDetailsAssignOutofTimeLabel"
                    />
                  </span>
                  Out of Time
                </p>
              </div>
            </div>
            <div className="TeamtaskDetailsAssignedInsideDiv">
              {assignedWithMembers?.members.map((member) => (
                <div key={member._id}>
                  <div className="TeamtaskDetailsAssignedHeaderDiv">
                    <div
                      className="TeamtaskDetAssignedProfile"
                      onClick={
                        data?.isAdmin
                          ? () => ClickOnAssignTask(member._id)
                          : null
                      }
                    >
                      <FontAwesomeIcon
                        icon={faUser}
                        className="TeamtaskDetAssignProfPic"
                      />
                      <p className="text">
                        {" "}
                        {member.firstName} {member.lastName}
                      </p>
                    </div>
                    {data?.isAdmin ? (
                      <FontAwesomeIcon
                        icon={faPlus}
                        className="TeamtaskDetailsAssignPlusIcon"
                      />
                    ) : null}
                  </div>
                  {member.tasks.map((task, index) => (
                    <div
                      key={index}
                      className="TeamtaskDetailsAssignEachAssignedMainDiv text"
                    >
                      <div>
                        {task.status === "Not Started" ||
                        task.status === "In Progress" ? (
                          <FontAwesomeIcon
                            icon={faSquare}
                            className={
                              task.status === "Not Started"
                                ? "TeamtaskDetailsAssignedNotStrt"
                                : task.status === "In Progress"
                                ? "TeamtaskDetailsAssignInProg"
                                : null
                            }
                          />
                        ) : task.status === "Completed" ? (
                          <FontAwesomeIcon
                            icon={faSquareCheck}
                            className="TeamtaskDetailsAssigneCompleted"
                          />
                        ) : task.status === "Out of Time" ? (
                          <FontAwesomeIcon
                            icon={faSquareXmark}
                            className="TeamtaskDetailsAssignOutOfTimeIcon"
                          />
                        ) : null}
                        <p>{task.name}</p>
                      </div>
                      {data?.isAdmin ? (
                        <FontAwesomeIcon
                          icon={faTrashCan}
                          className="TeamtaskDetailsAssignDelEachAssign"
                          onClick={() => setAssignedTaskDel(task._id)}
                        />
                      ) : null}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="TeamtaskDetailsResourceMainDiv">
            <div className="TeamtaskDetailsResourcesTitle text">
              <p>Resources</p>
            </div>
            <div className="TeamtaskDetailsResourceInsideDiv">
              {data?.fileType === "None" ? (
                <p className="NoResourceMainText text">No resoource provided</p>
              ) : (
                <div></div>
              )}
            </div>
          </div>

          <div className="TeamtaskDetailsSubmissionsMainDiv">
            <div className="TeamtaskDetailsSubmissionTitle text">
              <p>Submissions</p>
              {data?.submissions.length !== 0 ? (
                <p>{data?.submissions.length}</p>
              ) : null}
            </div>
            <div className="TeamtaskDetailsSubmissionsInsideDiv">
              {data?.submissions.length === 0 ? (
                <p className="NoSubmissionsMainText text">
                  No submissions made yet
                </p>
              ) : (
                <div></div>
              )}
            </div>
          </div>
        </div>

        {msg !== null && confirm !== null ? (
          <div className="OverflowAddMainDiv">
            <TeamConfirm
              setMsg={setMsg}
              msg={msg}
              confirm={confirm}
              setConfirm={setConfirm}
              team={data?.team}
            />
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

        {assignedTaskDel !== null ? (
          <div className="OverflowAddMainDiv">
            <TeamTaskConfirm
              getId={assignedTaskDel}
              setGetId={setAssignedTaskDel}
            />
          </div>
        ) : null}

        {showAssign && (
          <div className="OverflowAddMainDiv">
            <CreateSubtask
              teamId={teamId}
              teamtaskId={teamtaskId}
              userId={userId}
              setShowAssign={setShowAssign}
              setTeamId={setTeamId}
              setTeamtaskId={setTeamtaskId}
              setUserId={setUserId}
            />
          </div>
        )}
      </div>
    </section>
  );
}
