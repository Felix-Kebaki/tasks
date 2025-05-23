import React, { useState } from "react";
import "./objectiveForm.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import { useCreateObjectiveMutation } from "../../redux/api/todayApiSlice";
import { useToast } from "../../context/ToastContext";

import Loader from "../../assets/images/blackLoader.png"

export function ObjectiveForm({ setAdd }) {
  const [objForm, setObjForm] = useState({
    objective: "",
    startTime: "",
    endTime: "",
    category: "",
  });
  const { objective, startTime, endTime, category } = objForm;
  const [createObjective, { isLoading }] = useCreateObjectiveMutation();
  const {showToast}=useToast()

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
      const response = await createObjective(objForm);
      if (response.error) {
        showToast(response.error.data.error || response.error.error,"error");
        setAdd(false)
      } else {
        showToast(response.data.message,"success");
        setAdd(false);
      }
    } catch (error) {
      console.error(error.message);
    }
  };
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
              <button className={isLoading?"SubmitAuthLoaderObjective":"CreateObjectiveBtn text"}>{isLoading?<img src={Loader} alt="Loading..."/>:"Create"} </button>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
}
