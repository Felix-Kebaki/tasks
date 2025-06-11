import React, { useMemo, useState } from "react";
import "./invite.css";

import { useSendInviteMutation } from "../../redux/api/invitesApiSlice";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import Loader from "../../assets/images/blackLoader.png";

export function Invite({ invite, setInvite }) {
  const [errorMessage, setErrorMessage] = useState("");
  const [email, setEmail] = useState("");
  const [sendInvite, { isLoading }] = useSendInviteMutation();
  const HandleSubmitInvite = async (e) => {
    e.preventDefault();
    try {
      const res = await sendInvite({ data: { email }, teamId: invite });
      if (res.error) {
        setErrorMessage(res.error.data.error || res.error.error);
        setTimeout(() => {
          setErrorMessage("");
        }, 3000);
      } else {
        console.log(res.data.message);
        setInvite(null);
      }
    } catch (error) {
      console.error(error.message);
      setErrorMessage(error.message || error);
      setTimeout(() => {
        setErrorMessage("");
      }, 3000);
    }
  };

  const CloseInviteForm = () => {
    setInvite(null);
  };

  const isUnchangedInvite = useMemo(() => {
    return email.length !== 0;
  }, [email]);

  return (
    <section className="InviteMainSec">
      <form onSubmit={HandleSubmitInvite} className="InviteMainForm">
        <div className="TopInviteMainDiv">
          <p className="TopInviteMainTitle title">
            Enter the user's email you intend to invite
          </p>
          <FontAwesomeIcon
            icon={faXmark}
            onClick={CloseInviteForm}
            className="InviteFormCloseIcon"
          />
        </div>
        <div className="InviteInputEmailDiv">
          <label htmlFor="inviteEmailId" className="text">
            Email address
          </label>
          <br />
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            id="inviteEmailId"
            className="text"
          />
        </div>
        <div className="InviteFormSubmitMainDiv text">
          <button
            disabled={!isUnchangedInvite}
            type="submit"
            className={
              !isUnchangedInvite
                ? "InviteDisableBtn text"
                : isLoading
                ? "InviteLoader"
                : !isLoading
                ? "InviteFormSubmit text"
                : null
            }
          >
            {isLoading ? <img src={Loader} alt="Loading..." /> : "Invite"}
          </button>
        </div>
        <pre className="text">{errorMessage !== "" ? errorMessage : null}</pre>
      </form>
    </section>
  );
}
