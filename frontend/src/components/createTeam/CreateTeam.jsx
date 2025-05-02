import React, { useState } from "react";
import "./createTeam.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

import { useCreateTeamMutation } from "../../redux/api/teamApiSlice";
import { useSendInviteMutation } from "../../redux/api/invitesApiSlice";

export function CreateTeam({ setAdd }) {
  const [teamName, setTeamName] = useState("");
  const [invited, setInvited] = useState([]);

  const [createTeam, { isLoading }] = useCreateTeamMutation();
  const [sendInvite] = useSendInviteMutation();

  const HandleInviteClick = () => {
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
      } else {
        const response = await createTeam({ name: teamName });
        if (response.error) {
          console.error(response.error.data.error || response.error.error);
        } else {
          console.log(response.data.message);
          const teamId = response.data.teamId;
          for (const each of invited) {
            if (each?.trim()) {
              const res = await sendInvite({ data: { email: each } , teamId});
              if (res.error) {
                console.log(res.error.data.error || res.error.error);
              } else {
                console.log("Invitation sent successfully");
              }
            }
          }
          setAdd(false);
        }
      }
    } catch (error) {
      console.log(error.message);
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
                <FontAwesomeIcon icon={faPlus} id="PlusObjective" /> Another
                member
              </div>
              <div className="CreateTeamSubmitBtn">
                <button type="submit" className="text">
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
}
