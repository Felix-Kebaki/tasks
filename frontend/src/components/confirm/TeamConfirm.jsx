import React from "react";

import { useDeleteTeamMutation } from "../../redux/api/teamApiSlice";
import { useDeleteTeamtaskMutation } from "../../redux/api/teamTaskApiSlice";

export function TeamConfirm({ msg, setMsg, confirm, setConfirm }) {
  const [deleteTeam] = useDeleteTeamMutation();
  const [deleteTeamtask]=useDeleteTeamtaskMutation()

  const Cancel = () => {
    setConfirm(null);
    setMsg("");
  };

  const HandleDeleteTeam = async () => {
    try {
      const res = await deleteTeam({ teamId: confirm });
      if (res.error) {
        console.error(res.error.data.error || res.error.error);
      } else {
        console.log(res.data.message);
        setMsg("");
        setConfirm(null);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const HandleDeleteTeamtask = async () => {
    try {
      const res = await deleteTeamtask({ teamtaskId:confirm });
      if (res.error) {
        console.error(res.error.data.error || res.error.error);
      } else {
        console.log(res.data.message);
        setMsg("")
        setConfirm(null)
      }
    } catch (error) {
      console.error(error.message);
    }
  };
  return (
    <section className="ConfirmMainSec">
      <div className="ConfirmMainDiv">
        <p className="ConfirmationMainTitle title">Confirmation</p>
        <p className="ConfirmationMainDesc text">{msg}</p>
        <div>
          <button
            onClick={
              msg ===
              "Are you sure you want the team and all it's data to be deleted"
                ? HandleDeleteTeam
                :msg ==="Are you sure you want the Teamtask deleted with all of it's data"
                ?HandleDeleteTeamtask
                : null
            }
          >
            confirm
          </button>
          <button onClick={Cancel}>cancel</button>
        </div>
      </div>
    </section>
  );
}
