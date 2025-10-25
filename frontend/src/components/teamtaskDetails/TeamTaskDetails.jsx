import "./teamtaskDetails.css";

import { useEffect, useState } from "react";
import moment from "moment";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import { useGetEachTeamtaskQuery } from "../../redux/api/teamTaskApiSlice";
import { TeamConfirm } from "../confirm/TeamConfirm";
import { EditTeamtask } from "../EditTeamtask/EditTeamtask";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";

export function TeamTaskDetails() {
  const { userInfo } = useSelector((state) => state.auth);
  const param = useParams();
  const { data, refetch, isLoading } = useGetEachTeamtaskQuery(param.id);

  const [msg, setMsg] = useState(null);
  const [confirm,setConfirm]=useState(null)
  const [editTeamtask,setEditTeamtask]=useState(null);

  const ClickOnDeleteTeamtask = (getId) => {
    setMsg("Are you sure you want the Teamtask deleted with all of it's data");
    setConfirm(getId)
  };

  const ClickOnEditTeamtask=(getId)=>{
    setEditTeamtask(getId)
  }

  useEffect(() => {
    refetch();
  }, [refetch,msg,confirm,editTeamtask]);

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
            {data?.admin === userInfo._id ? (
              <div className="TeamtaskDetailsTopButtonsDiv text">
                <div onClick={()=>ClickOnEditTeamtask(data?._id)}>
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

        {(msg !== null && confirm!==null)? (
          <div className="OverflowAddMainDiv">
            <TeamConfirm setMsg={setMsg} msg={msg} confirm={confirm} setConfirm={setConfirm} team={data?.team}/>
          </div>
        ) : null}

         {
           editTeamtask!==null?(<div className="OverflowAddMainDiv">
            <EditTeamtask editTeamtask={editTeamtask} setEditTeamtask={setEditTeamtask}/>
           </div>):null  
        }
      </div>
    </section>
  );
}
