import React, { useMemo, useState } from "react";
import "./objectiveForm.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import { useCreateObjectiveMutation } from "../../redux/api/todayApiSlice";
import { useToast } from "../../context/ToastContext";

import Loader from "../../assets/images/blackLoader.png";

export function ObjectiveForm({ setAdd }) {
  const [errorMessage, setErrorMessage] = useState("");
  const [objForm, setObjForm] = useState({
    objective: "",
    startTime: "",
    endTime: "",
    category: "",
  });
  const { objective, startTime, endTime, category } = objForm;
  const [createObjective, { isLoading }] = useCreateObjectiveMutation();
  const { showToast } = useToast();

  const HandleRemoveForm = () => {
    setAdd(false);
  };

  const OnChange = (e) => {
    setObjForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const HandleSubmitObjective = async (e) => {
    e.preventDefault();
    try {
      const timezone=Intl.DateTimeFormat().resolvedOptions().timeZone;
      console.log(timezone)
      const response = await createObjective({...objForm,timezone});
      if (response.error) {
        setErrorMessage(response.error.data.error || response.error.error);
        setTimeout(() => {
          setErrorMessage("");
        }, 3000);
      } else {
        showToast(response.data.message, "success");
        setAdd(false);
      }
    } catch (error) {
      console.error(error.message);
      setErrorMessage(error.message || error);
      setTimeout(() => {
        setErrorMessage("");
      }, 3000);
    }
  };

  const isUnchanged = useMemo(() => {
    return (
      objective === "" && startTime === "" && endTime === "" && category === ""
    );
  }, [objective, startTime, endTime, category]);

  return (
    <section className="ObjectiveFormMainSec">
      <form onSubmit={HandleSubmitObjective} className="ObjectiveFormMainDiv">
        <div className="ObjectiveFormTopDiv">
          <p className="text">Create Objective</p>
          <FontAwesomeIcon
            icon={faXmark}
            onClick={HandleRemoveForm}
            id="closeObjectiveForm"
          />
        </div>
        <div className="ActualObjectiveFormDiv">
          <div className="ObjectiveTextareaDiv text">
            <label htmlFor="objectiveId">Objective</label>
            <br />
            <textarea
              id="objectiveId"
              value={objective}
              onChange={OnChange}
              name="objective"
              className="text"
            ></textarea>
          </div>
          <div className="StartStopAndCategoryObjectiveDiv">
            <div className="StartStopObjectiveMainDiv">
              <div className="text">
                <label htmlFor="StartTimeId">Start</label>
                <br />
                <input
                  type="time"
                  id="StartTimeId"
                  value={startTime}
                  onChange={OnChange}
                  name="startTime"
                  className="ClockInput text"
                />
              </div>
              <div className="text">
                <label htmlFor="StopTimeId">Stop</label>
                <br />
                <input
                  type="time"
                  id="StopTimeId"
                  value={endTime}
                  onChange={OnChange}
                  name="endTime"
                  className="ClockInput text"
                />
              </div>
            </div>
            <div className="CategoryObjectiveDiv text">
              <label htmlFor="categoryId">Category</label>
              <br />
              <input
                type="text"
                id="categoryId"
                value={category}
                onChange={OnChange}
                name="category"
                className="text"
              />
            </div>
            <div className="CreateObjectiveBtnDiv">
              <button
                disabled={isUnchanged}
                className={
                  isUnchanged
                    ? "CreateObjectiveDisabled text"
                    : isLoading
                    ? "CreateObjLoader"
                    : !isLoading
                    ? "CreateObjectiveBtn text"
                    : null
                }
              >
                {isLoading ? <img src={Loader} alt="Loading..." /> : "Create"}{" "}
              </button>
            </div>
          </div>
        </div>
        <pre className="text">{errorMessage !== "" ? errorMessage : null}</pre>
      </form>
    </section>
  );
}
