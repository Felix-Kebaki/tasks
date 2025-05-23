import React, { useEffect, useState } from "react";
import { CreateTeam } from "../createTeam/CreateTeam";
import { TeamConfirm } from "../confirm/TeamConfirm";
import {Loading} from '../loading/Loading'
import "./team.css";

import { useGetYourTeamsQuery } from "../../redux/api/teamApiSlice";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";

import { Link } from "react-router-dom";

export function Team() {
  const [add, setAdd] = useState(false);
  const [confirm,setConfirm]=useState(null)
  const [msg,setMsg]=useState("")

  const { refetch, data: yourTeams, isLoading } = useGetYourTeamsQuery();

  const HandleAddTeam = () => {
    setAdd(true);
  };

  const HandleClickDeleteTeam=(id)=>{
    setConfirm(id)
    setMsg("Are you sure you want the team and all it's data to be deleted")
  }

  useEffect(() => {
    refetch();
  }, [refetch, add,confirm]);

  if(isLoading){
    return(
      <div className="MainLoaderDiv">
        <Loading/>
      </div>
    )
  }

  return (
    <section className="TeamMainSec">
      <div className="TeamMainDiv">
        <div className="TopAtTeamDiv">
          <p className="title">Your teams</p>
        </div>
        <div className="AllYourTeamsWrapperDiv">
          {yourTeams && yourTeams.length !== 0 ? (
            yourTeams &&
            yourTeams.map((team) => (
              <div className="EachTeamMainDiv" key={team._id}>
                <Link to={"/app/teams/eachTeamtask/"+team._id}>
                  <FontAwesomeIcon icon={faCircle} id="EachTeamDot" />
                  <p className="teamName text">{team.name}</p>
                  {team.isAdmin ? (
                    <p className="isAdmin text">(Admin)</p>
                  ) : (
                    <p className="NotisAdmin text">(Not an admin)</p>
                  )}
                </Link>
                {team.isAdmin?
                <FontAwesomeIcon
                  icon={faTrashCan}
                  className="DeleteTeamIcon"
                  onClick={() => HandleClickDeleteTeam(team._id)}
                />:null}
              </div>
            ))
          ) : (
            <div className="NoTeamMainDiv">
              <p className="NotAMemberOfTeamText text">
                You're not a member of any team
              </p>
            </div>
          )}
          <div className="AddTeamButton text" onClick={HandleAddTeam}>
            <FontAwesomeIcon icon={faPlus} id="PlusTeam" /> Create a Team
          </div>
        </div>

        {add ? (
          <div className="OverflowAddMainDiv">
            <CreateTeam setAdd={setAdd} />
          </div>
        ) : null}

        {
            confirm!==null?
            <div className="OverflowAddMainDiv">
            <TeamConfirm confirm={confirm} msg={msg} setMsg={setMsg} setConfirm={setConfirm}/>
          </div>:null
        }
      </div>
    </section>
  );
}
