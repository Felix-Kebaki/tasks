import "./teamtaskDetails.css";

import { useEffect, useState } from "react";
import moment from "moment";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useToast } from "../../context/ToastContext";
import { Link } from "react-router-dom";

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
import { faLink } from "@fortawesome/free-solid-svg-icons";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { faSquare } from "@fortawesome/free-regular-svg-icons";
import { faSquareCheck } from "@fortawesome/free-regular-svg-icons";
import { faImage } from "@fortawesome/free-regular-svg-icons";
import { faFile } from "@fortawesome/free-regular-svg-icons";
import { AddResourceComp } from "../addResource/AddResourceComp";
import { ViewImgResource } from "../Assets/ViewImgResource";

export function TeamTaskDetails() {
  const { userInfo } = useSelector((state) => state.auth);
  const param = useParams();
  const { showToast } = useToast();

  const { data, refetch, isLoading } = useGetEachTeamtaskQuery(param.id);
  const {
    data: assignedWithMembers,
    refetch: assignedRefetch,
    isLoading: assignedLoading,
  } = useGetAssignedMembersQuery(
    { teamId: data?.teamId, teamtaskId: data?.teamtaskId },
    { skip: !data?.teamId || !data?.teamtaskId },
  );

  const [msg, setMsg] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [editTeamtask, setEditTeamtask] = useState(null);
  const [assignedTaskDel, setAssignedTaskDel] = useState(null);
  const [userId, setUserId] = useState(null);
  const [teamtaskId, setTeamtaskId] = useState(null);
  const [teamId, setTeamId] = useState(null);
  const [showAssign, setShowAssign] = useState(false);
  const [addResource, setAddResource] = useState(null);
  const [viewResource, setViewResource] = useState(null);

  const navigate = useNavigate();

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

  const HandleClickOnAddResource = () => {
    setAddResource(param.id);
  };

  const HandleClickOfResource = (getfileUrl) => {
    setViewResource(getfileUrl);
  };

  useEffect(() => {
    refetch();
    console.log(data);

    if (data?.teamId) {
      assignedRefetch();
    }
  }, [
    refetch,
    assignedRefetch,
    msg,
    confirm,
    editTeamtask,
    assignedTaskDel,
    showAssign,
    addResource,
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
                  <div
                    className="TeamtaskDetailsAssignedHeaderDiv"
                    onClick={
                      data?.isAdmin ? () => ClickOnAssignTask(member._id) : null
                    }
                  >
                    <div className="TeamtaskDetAssignedProfile">
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
              <div className="TeamtaskDetailsResourceInsideTopDiv">
                {data?.resources.length === 0 ? (
                  <p className="NoResourceMainText text">
                    No resoource provided
                  </p>
                ) : (
                  <div className="TeamtaskDetailsResourceMainActualDiv">
                    {data?.resources.map((res) => (
                      <>
                        {res.fileType === "Link" ||
                        res.fileType === "Document" ? (
                          <a
                            href={res.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="TeamtaskDetailsResourceMainWrapperDiv"
                            key={res.filePublicId}
                          >
                            {res.fileType === "Document" ? (
                              <div>
                                <FontAwesomeIcon icon={faFile} />
                              </div>
                            ) : res.fileType === "Link" ? (
                              <div>
                                <FontAwesomeIcon icon={faLink} />
                              </div>
                            ) : null}
                            <p className="text">
                              {res.fileType === "Document"
                                ? res.filePublicId.split("-")[1]
                                : res.fileType === "Link"
                                  ? res.fileUrl
                                  : null}
                            </p>
                          </a>
                        ) : (
                          <div
                            className="TeamtaskDetailsResourceMainWrapperDiv"
                            onClick={() => HandleClickOfResource(res.fileUrl)}
                          >
                            <div>
                              <FontAwesomeIcon icon={faImage} />
                            </div>
                            <p className="text">
                              {res.filePublicId.split("-")[1]}
                            </p>
                          </div>
                        )}
                      </>
                    ))}
                  </div>
                )}
              </div>
              {data?.isAdmin ? (
                <div
                  className="TeamtaskAddResourceButtonDiv text"
                  onClick={HandleClickOnAddResource}
                >
                  Add a resource
                </div>
              ) : null}
            </div>
          </div>

          <div className="TeamtaskDetailsSubmissionsMainDiv">
            <div className="TeamtaskDetailsSubmissionTitle text">
              <p>
                {data?.expectedSubmissions.length !== 0 &&
                data?.submissions.length === 0
                  ? "Expected Submissions"
                  : data?.expectedSubmissions.length === 0 &&
                      data?.submissions.length !== 0
                    ? "Submissions"
                    : null}
              </p>
              {data?.expectedSubmissions.length !== 0 &&
              data?.submissions.length === 0 ? (
                <div>{data?.expectedSubmissions.length}</div>
              ) : data?.expectedSubmissions.length === 0 &&
                data?.submissions.length !== 0 ? (
                <div>{data?.submissions.length}</div>
              ) : null}
            </div>
            <div className="TeamtaskDetailsSubmissionsInsideDiv">
              {data?.expectedSubmissions.length === 0 ? (
                <p className="NoExpectedSubmissionsMainText text">
                  No submissions expected
                </p>
              ) : data?.expectedSubmissions.length !== 0 &&
                data?.submissions.length === 0 ? (
                <div className="ExpectedSubmissionsNoneMadeMainDiv">
                  {data?.expectedSubmissions.map((each, index) => (
                    <div
                      className="ExpectedSubmissionNoneMadeInsideDiv"
                      key={index}
                    >
                      <p className="text">
                        <span id="ExpectedSubmissionNumbering">
                          {index + 1}.
                        </span>
                        <span id="ExpectedSubmissionName">
                          {each.user.firstName} {each.user.lastName}
                        </span>
                      </p>
                      <p className="ExpectedSubmissionsActualFile text">
                        {each.fileType}
                      </p>
                    </div>
                  ))}
                </div>
              ) : data?.expectedSubmissions.length !== 0 &&
                data?.submissions.length !== 0 ? (
                <div className="SubmissionsWithExpectedDiv">
                  <div className="SubmissionsLengthDiv text">
                    <p
                      className={
                        data?.expectedSubmissions.length === 0
                          ? "CenterItAsAllIsSubmitted text"
                          : "ExpectedSubmissionsTitle text"
                      }
                    >
                      {data?.expectedSubmissions.length === 0
                        ? "All have been submitted"
                        : "Expected Submissions"}
                    </p>
                    <div>{data?.expectedSubmissions.length}</div>
                  </div>
                  {data?.expectedSubmissions.map((expSub, index) => (
                    <div
                      className="ExpectedSubmissionNoneMadeInsideDiv"
                      key={index}
                    >
                      <p className="text">
                        <span id="ExpectedSubmissionNumbering">
                          {index + 1}.
                        </span>
                        <span id="ExpectedSubmissionName">
                          {expSub.user.firstName} {expSub.user.lastName}
                        </span>
                      </p>
                      <p className="ExpectedSubmissionsActualFile text">
                        {expSub.fileType}
                      </p>
                    </div>
                  ))}
                  <div className="SubmissionsLengthDiv text">
                    <p className="SubmittedOnesTitle text">Submitted ones</p>
                    <div>{data?.submissions.length}</div>
                  </div>
                  <div className="TeamtaskDetailsResourceMainActualDiv">
                    {data?.submissions.map((res) => (
                      <>
                        {res.fileType === "Link" ||
                        res.fileType === "Document" ? (
                          <a
                            href={res.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="TeamtaskDetailsResourceMainWrapperDiv"
                            key={res.filePublicId}
                          >
                            {res.fileType === "Document" ? (
                              <div>
                                <FontAwesomeIcon icon={faFile} />
                              </div>
                            ) : res.fileType === "Link" ? (
                              <div>
                                <FontAwesomeIcon icon={faLink} />
                              </div>
                            ) : null}
                            <p className="text">
                              {res.fileType === "Document"
                                ? res.submissionPublicId.split("-")[1]
                                : res.fileType === "Link"
                                  ? res.fileUrl
                                  : null}
                            </p>
                          </a>
                        ) : (
                          <div
                            className="TeamtaskDetailsResourceMainWrapperDiv"
                            onClick={() => HandleClickOfResource(res.fileUrl)}
                          >
                            <div>
                              <FontAwesomeIcon icon={faImage} />
                            </div>
                            <p className="text">
                              {res.submissionPublicId.split("-")[1]}
                            </p>
                          </div>
                        )}
                      </>
                    ))}
                  </div>
                </div>
              ) : null}
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

        {addResource !== null ? (
          <div className="OverflowAddMainDiv">
            <AddResourceComp
              addResource={addResource}
              setAddResource={setAddResource}
            />
          </div>
        ) : null}

        {viewResource !== null ? (
          <div className="OverflowAddMainDiv">
            <ViewImgResource
              setViewResource={setViewResource}
              viewResource={viewResource}
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}
