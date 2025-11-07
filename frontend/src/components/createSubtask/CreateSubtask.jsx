import "./createSubtask.css";

import { useState, useMemo } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import { useAssignTaskMutation } from "../../redux/api/assignTaskApiSlice";

import Loader from "../../assets/images/blackLoader.png";

export function CreateSubtask({ teamId, teamtaskId, userId, setShowAssign ,setTeamId,setTeamtaskId,setUserId}) {
  const [subtask, setSubtask] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [submission, setSubmission] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [assignTask, { isLoading }] = useAssignTaskMutation();

  const HandleClickAssign = async (e) => {
    e.preventDefault();
    try {
      const res = await assignTask({
        teamId,
        teamtaskId,
        userId,
        data: {name:subtask,dueDate,submission}
      });
      if (res.error) {
        console.error(res.error.data.error || res.error.error);
        setErrorMessage(res.error.data.error || res.error.error);
        setTimeout(() => {
          setErrorMessage("");
        }, 3000);
      } else {
        setShowAssign(false);
        setTeamId(null);
        setTeamtaskId(null);
        setUserId(null);
      }
    } catch (error) {
      console.error(error.message || error);
      setErrorMessage(error.message || error);
      setTimeout(() => {
        setErrorMessage("");
      }, 3000);
    }
  };

  const CancelBtnClicked = () => {
    setShowAssign(false);
    setTeamId(null);
    setTeamtaskId(null);
    setUserId(null);
  };

  const isUnchanged = useMemo(() => {
    return subtask === "" && dueDate === "" && submission === "";
  }, [subtask, dueDate, submission]);

  return (
    <section className="CreateSubtaskMainSec">
      <form className="CreateSubtaskMainDiv" onSubmit={HandleClickAssign}>
        <div className="CreateSubtaskTopDiv">
          <div>
            <p className="CreateSubtaskTitle title">Assign Subtask</p>
            <p className="CreateSubtaskDesc text">
              Assign a clear, specific task for this member. Include what needs
              to be done and key details to keep progress organized and on
              track.
            </p>
          </div>
          <FontAwesomeIcon
            icon={faXmark}
            onClick={CancelBtnClicked}
            className="CloseAssignSubtaskIcon"
          />
        </div>
        <div className="CreatesubtaskAllInputDiv text">
          <div>
            <label htmlFor="subtaskLabel">subtask</label>
            <br />
            <input
              type="text"
              value={subtask}
              onChange={(e) => setSubtask(e.target.value)}
              id="subtaskLabel"
            />
          </div>
          <div>
            <label htmlFor="dueDateLabel">Due date</label>
            <br />
            <input
              type="date"
              className="text"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              id="dueDateLabel"
            />
          </div>
          <div>
            <label htmlFor="submissionLabel">Expected submission</label>
            <br />
            <select
              value={submission}
              onChange={(e) => setSubmission(e.target.value)}
            >
              <option value="" disabled selected>
                Select submission
              </option>
              <option value="None">None</option>
              <option value="Link">Link</option>
              <option value="Photo">Photo</option>
              <option value="Document">Document</option>
            </select>
          </div>
          <div className="CreateSubtaskBtnDiv">
            <button
              disabled={isUnchanged}
              className={
                isUnchanged
                  ? "CreateSubtaskDisabled text"
                  : isLoading
                  ? "CreateSubtaskLoader"
                  : !isLoading
                  ? "CreateSubtaskAtFormBtn text"
                  : null
              }
            >
              {isLoading ? <img src={Loader} alt="Loading..." /> : "Assign"}
            </button>
          </div>
        </div>
        <pre className="text">{errorMessage !== "" ? errorMessage : null}</pre>
      </form>
    </section>
  );
}
