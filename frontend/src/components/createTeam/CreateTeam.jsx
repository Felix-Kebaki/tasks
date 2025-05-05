import React, { useEffect, useState } from "react";
import "./createTeam.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

import Loader from '../../assets/images/Loader.png'

import { useCreateTeamMutation } from "../../redux/api/teamApiSlice";
import { useSendInviteMutation } from "../../redux/api/invitesApiSlice";

export function CreateTeam({ setAdd }) {
  const [teamName, setTeamName] = useState("");
  const [invited, setInvited] = useState([]);
  const [inviteMemberNo, setInviteMemberNo] = useState(0);
  const [errorMessage,setErrorMessage]=useState("")

  const [createTeam, { isLoading }] = useCreateTeamMutation();
  const [sendInvite, { isLoading: inviteLoading }] = useSendInviteMutation();

  const HandleInviteClick = () => {
    setInviteMemberNo((prev) => prev + 1);
    setInvited((prev) => [...prev, ""]);
  };

  const OnChange = (index, value) => {
    const updated = [...invited];
    updated[index] = value;
    setInvited(updated);
  };

  const HandleSubmitCreateTeam = async (e) => {
    e.preventDefault();
    try {
      if (invited.length === 0) {
        console.error("Invite atleast one user");
        setErrorMessage("Invite atleast one user");
        setTimeout(() => {
          setErrorMessage("");
        }, 3000);
      } else {
        const response = await createTeam({ name: teamName });
        if (response.error) {
          console.error(response.error.data.error || response.error.error);
          setErrorMessage(response.error.data.error || response.error.error);
          setTimeout(() => {
            setErrorMessage("");
          }, 3000);
        } else {
          console.log(response.data.message);
          const teamId = response.data.teamId;
          for (const each of invited) {
            if (each?.trim()) {
              const res = await sendInvite({ data: { email: each }, teamId });
              if (res.error) {
                console.log(res.error.data.error || res.error.error);
                setErrorMessage(res.error.data.error || res.error.error);
                setTimeout(() => {
                  setErrorMessage("");
                }, 3000);
              } else {
                console.log("Invitation sent successfully");
              }
            }
          }
          setInviteMemberNo(0);
          setAdd(false);
        }
      }
    } catch (error) {
      console.log(error.message);
      setErrorMessage(error.message);      
      setTimeout(() => {
        setErrorMessage("");
      }, 3000);
    }
  };


  return (
    <section className="CreateTeamMainSec">
      <form className="CreateTeamMainForm" onSubmit={HandleSubmitCreateTeam}>
        <div className="CreateTeamTopDiv">
          <p className="CreateTeamTitle title">Create a team</p>
          <FontAwesomeIcon
            icon={faXmark}
            onClick={() => setAdd(false)}
            className="CloseAddTeamIcon"
          />
        </div>

        <p className="CreateTeamDesc text">
          Create your own team, invite members, set shared goals, and
          collaborate effortlessly. Build success together with powerful
          teamwork tools.
        </p>
        <div className="CreateTeamDivWithInputs">
          <div className="OnlyTeamNameDiv text">
            <label htmlFor="TeamNameId">Team name</label>
            <br />
            <input
              type="text"
              value={teamName}
              id="TeamNameId"
              onChange={(e) => setTeamName(e.target.value)}
              className="text"
            />
          </div>
          <div className="InviteAtCreateTeamMainDiv">
            <p className="NoteTextInInvite text">
              You need to invite atleast one registered user into your team.
            </p>
            <div className="CreateTeamAllInvitesInputDiv">
              {invited &&
                invited.map((each, index) => (
                  <input
                    type="email"
                    key={index}
                    placeholder={
                      index > 0
                        ? `member number ${index + 1}`
                        : `Invite a team member by email`
                    }
                    value={invited[index]}
                    onChange={(e) => OnChange(index, e.target.value)}
                    className="text"
                  />
                ))}
              <div
                className="CreateTeamInviteMemberBtn text"
                onClick={HandleInviteClick}
              >
                <FontAwesomeIcon icon={faPlus} id="PlusObjective" />
                {inviteMemberNo !== 0 ? "Add another " : "Invite a "}
                member
              </div>
              <div className="CreateTeamSubmitBtn">
                <button type="submit" className={isLoading || inviteLoading?"SubmitAllLoaderMode":"CreateTeamSubmitActualBtn text"}>
                  {isLoading || inviteLoading ? (
                    <img
                      src={Loader}
                      alt="Loading..."
                      className="LoaderImage"
                    />
                  ) : (
                    "Create"
                  )}
                </button>
              </div>
              <pre className="text">{errorMessage ? errorMessage : null}</pre>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
}
