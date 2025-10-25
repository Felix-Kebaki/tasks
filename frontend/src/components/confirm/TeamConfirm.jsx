

import { useToast } from "../../context/ToastContext";
import { useNavigate } from "react-router-dom";

import { useDeleteTeamMutation } from "../../redux/api/teamApiSlice";
import { useDeleteTeamtaskMutation } from "../../redux/api/teamTaskApiSlice";

export function TeamConfirm({ msg, setMsg, confirm, setConfirm ,team}) {
  const [deleteTeam] = useDeleteTeamMutation();
  const [deleteTeamtask]=useDeleteTeamtaskMutation()

  const navigate=useNavigate()

  const {showToast}=useToast()

  const Cancel = () => {
    setConfirm(null);
    setMsg(null);
  };

  const HandleDeleteTeam = async () => {
    try {
      const res = await deleteTeam({ teamId: confirm });
      if (res.error) {
        console.error(res.error.data.error || res.error.error);
        showToast(res.error.data.error || res.error.error,"error")
      } else {
        showToast(res.data.message,"success");
        setMsg(null);
        setConfirm(null);
        navigate("/app/teams")
      }
    } catch (error) {
      console.log(error.message||error);
      showToast(error.message||error,"error")
    }
  };

  const HandleDeleteTeamtask = async () => {
    try {
      const res = await deleteTeamtask(confirm);
      if (res.error) {
        console.error(res.error.data.error || res.error.error);
        showToast(res.error.data.error || res.error.error,"error")
      } else {
        showToast(res.data.message,"success");
        setMsg(null)
        setConfirm(null)
        navigate(`/app/teams/eachTeam/${team}`)
      }
    } catch (error) {
      console.error(error.message||error,"error");
      showToast(error.message||error,"error")
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
