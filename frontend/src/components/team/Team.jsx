import { useEffect, useState } from "react";
import { CreateTeam } from "../createTeam/CreateTeam";
import {Loading} from '../loading/Loading'
import "./team.css";

import { useGetYourTeamsQuery } from "../../redux/api/teamApiSlice";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import {faFolder} from '@fortawesome/free-regular-svg-icons'

import { Link } from "react-router-dom";

export function Team() {
  const [add, setAdd] = useState(false);

  const { refetch, data: yourTeams, isLoading } = useGetYourTeamsQuery();

  const HandleAddTeam = () => {
    setAdd(true);
  };

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
            yourTeams.map((team,index) => (
              <div className="EachTeamMainDiv" key={team._id}>
                <Link to={"/app/teams/eachTeam/"+team._id}>
                <FontAwesomeIcon icon={faFolder} className="EachTeamIcon"/>
                  <p className="teamName text">{team.name}</p>
                  {team.isAdmin ? (
                    <p className="isAdmin text">(Admin)</p>
                  ) : (
                    <p className="NotisAdmin text">(Not an admin)</p>
                  )}
                </Link>
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
      </div>
    </section>
  );
}
