import { useState } from "react";
import "./createTeam.css";

import { useToast } from "../../context/ToastContext";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

import Loader from "../../assets/images/blackLoader.png";

import { useCreateTeamMutation } from "../../redux/api/teamApiSlice";
import { useSendInviteMutation } from "../../redux/api/invitesApiSlice";
import { useCheckUserMutation } from "../../redux/api/teamApiSlice";

export function CreateTeam({ setAdd }) {
  const [teamName, setTeamName] = useState("");
  const [invited, setInvited] = useState([]);
  const [inviteMemberNo, setInviteMemberNo] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  const { showToast } = useToast();

  const [createTeam, { isLoading }] = useCreateTeamMutation();
  const [sendInvite, { isLoading: inviteLoading }] = useSendInviteMutation();
  const [checkUser, { isLoading: checkloading }] = useCheckUserMutation();

  const HandleInviteClick = async (email) => {
    try {
      if (invited.length === 0) {
        setInviteMemberNo((prev) => prev + 1);
        setInvited((prev) => [...prev, ""]);
      } else {
        const res = await checkUser(email);
        if (res.error) {
          setErrorMessage(res.error.data.error || res.error.error);
          setTimeout(() => {
            setErrorMessage("");
          }, 3000);
        } else {
          setInviteMemberNo((prev) => prev + 1);
          setInvited((prev) => [...prev, ""]);
        }
      }
    } catch (error) {
      console.error(error.message || error);
      setErrorMessage(error.message || error);
      setTimeout(() => {
        setErrorMessage("");
      }, 3000);
    }
  };

  const OnChange = (index, value) => {
    const updated = [...invited];
    updated[index] = value;
    setInvited(updated);
  };

  const HandleSubmitCreateTeam = async (e) => {
    e.preventDefault();

    try {
      const res = await checkUser(invited);
      if (res.error) {
        setErrorMessage(res.error.data.error || res.error.error);
        setTimeout(() => {
          setErrorMessage("");
        }, 3000);
      } else {
        if (invited.length === 0) {
          setErrorMessage("Invite atleast one user");
          setTimeout(() => {
            setErrorMessage("");
          }, 3000);
        } else {
          const response = await createTeam({ name: teamName });
          if (response.error) {
            setErrorMessage(response.error.data.error || response.error.error);
            setTimeout(() => {
              setErrorMessage("");
            }, 3000);
          } else {
            const teamId = response.data.teamId;
            let success = false;
            for (const each of invited) {
              if (each?.trim()) {
                const res = await sendInvite({ data: { email: each }, teamId });
                if (res.error) {
                  showToast(res.error.data.error || res.error.error, "error");
                  continue;
                } else {
                  success = true;
                }
              }
            }
            if (success) {
              showToast("Invitations sent successfully", "success");
            }
            showToast(response.data.message, "success");
            setInviteMemberNo(0);
            setAdd(false);
          }
        }
      }
    } catch (error) {
      console.error(error.message);
      setErrorMessage(error.message);
      setTimeout(() => {
        setErrorMessage("");
      }, 3000);
    }
  };

  return (
    <section className="CreateTeamMainSec">
      <form className="CreateTeamMainForm">
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
                onClick={() => HandleInviteClick(invited)}
              >
                <FontAwesomeIcon icon={faPlus} id="PlusObjective" />
                {inviteMemberNo !== 0 ? "Add another " : "Invite a "}
                member{" "}
                {checkloading ? (
                  <img
                    src={Loader}
                    alt="Loading"
                    className="LoaderAtAddMemberToInvite"
                  />
                ) : null}
              </div>
              <div className="CreateTeamSubmitBtnDiv">
                <button
                  onClick={HandleSubmitCreateTeam}
                  className={
                    (isLoading || inviteLoading) && !checkloading
                      ? "CreateTeamLoader"
                      : "CreateTeamSubmitBtn text"
                  }
                >
                  {(isLoading || inviteLoading) && !checkloading ? (
                    <img src={Loader} alt="Loading..." />
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
