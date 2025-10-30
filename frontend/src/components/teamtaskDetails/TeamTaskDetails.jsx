import "./teamtaskDetails.css";

import { useEffect, useState } from "react";
import moment from "moment";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useToast } from "../../context/ToastContext";

import { useGetEachTeamtaskQuery } from "../../redux/api/teamTaskApiSlice";
import { useGetAssignedMembersQuery } from "../../redux/api/assignTaskApiSlice";
import { useAssignTaskMutation } from "../../redux/api/assignTaskApiSlice";

import { TeamConfirm } from "../confirm/TeamConfirm";
import { EditTeamtask } from "../EditTeamtask/EditTeamtask";
import { Loading } from "../loading/Loading";
import Loader from '../../assets/images/Loader.png'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";

export function TeamTaskDetails() {
  const { userInfo } = useSelector((state) => state.auth);
  const param = useParams();
  const {showToast}=useToast();

  const { data, refetch, isLoading } = useGetEachTeamtaskQuery(param.id);
  const {
    data: assignedWithMembers,
    refetch: assignedRefetch,
    isLoading: assignedLoading,
  } = useGetAssignedMembersQuery(data?.teamId, { skip: !data?.teamId });
  const [assignTask,{isLoading:assignLoading}]=useAssignTaskMutation()

  const [msg, setMsg] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [editTeamtask, setEditTeamtask] = useState(null);
  const [openId, setOpenId] = useState(null);
  const [subtask,setSubtask]=useState("")

  const ClickOnDeleteTeamtask = (getId) => {
    setMsg("Are you sure you want the Teamtask deleted with all of it's data");
    setConfirm(getId);
  };

  const ClickOnEditTeamtask = (getId) => {
    setEditTeamtask(getId);
  };

  const onClickOnArrow = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
    setSubtask("");
  };

  const HandleClickAssign=async(e,getUser)=>{
    e.preventDefault()
    try {
      const res=await assignTask({teamId:data?.teamId,teamTaskId:data?.teamtaskId,userId:getUser,data:{name:subtask}})
      if(res.error){
        showToast(res.error.data.error || res.error.error,"error")
        console.error(res.error.data.error || res.error.error)
      }else{
        showToast(res.data.message,"success");
        setOpenId(null)
        setSubtask("");
        assignedRefetch();
      }
    } catch (error) {
      console.error(error.message || error)
    }
  }

  useEffect(() => {
    refetch();

    if (data?.teamId) {
      assignedRefetch();
    }
  }, [refetch, assignedRefetch, msg, confirm, editTeamtask]);

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
                <div onClick={() => ClickOnEditTeamtask(data?._id)}>
                  <span>
                    <FontAwesomeIcon icon={faPenToSquare} />
                  </span>
                  <p>Edit</p>
                </div>
                <div onClick={() => ClickOnDeleteTeamtask(data?._id)}>
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
                  Out Of Time
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
            <div className="TeamtaskDetailsAssignedTitle text">
              <p>Assigned subtasks</p>
            </div>
            <div className="TeamtaskDetailsAssignedInsideDiv">
              {assignedWithMembers?.members.map((member) => (
                <div key={member._id}>
                  <div className="TeamtaskDetailsAssignedHeaderDiv">
                    <div className="TeamtaskDetAssignedProfile">
                      <FontAwesomeIcon icon={faUser} className="TeamtaskDetAssignProfPic"/>
                      <p className="text">
                        {" "}
                        {member.firstName} {member.lastName}
                      </p>
                    </div>
                    {data?.isAdmin ? (
                      <div onClick={() => onClickOnArrow(member._id)}>
                        {openId===member._id?
                        <FontAwesomeIcon icon={faChevronUp} className="TeamtaskDetAssignArrowBtn"/>:
                        <FontAwesomeIcon icon={faChevronDown} className="TeamtaskDetAssignArrowBtn"/>}
                      </div>
                    ) : null}
                  </div>
                  {openId === member._id ? (
                    <form onSubmit={(e)=>HandleClickAssign(e,member._id)} className="TeamtaskDetailsAssignFormDiv">
                      <input type="text" placeholder="Assign a subtask" value={subtask} onChange={(e)=>setSubtask(e.target.value)}/>
                      <button type="submit" disabled={assignLoading}>{assignLoading?<img src={Loader}/>:<FontAwesomeIcon icon={faCheck} />}</button>
                    </form>
                  ) : null}
                  {member.tasks.map((task,index)=>(
                    <div key={index} className="text">
                      <p>{task.name}</p>
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
      </div>
    </section>
  );
}
