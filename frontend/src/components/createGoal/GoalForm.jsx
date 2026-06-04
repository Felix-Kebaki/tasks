import React, { useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import "./goalForm.css";

import { useCreateGoalMutation } from "../../redux/api/goalApiSlice";

import Loader from "../../assets/images/blackLoader.png";

export function GoalForm({ setAdd }) {
  const [errorMessage, setErrorMessage] = useState("");
  const [goalForm, setGoalForm] = useState({
    name: "",
    description: "",
    status: "",
    category: "",
    priority: "",
    startDate: "",
    endDate: "",
    reward: "",
  });
  const {
    name,
    description,
    status,
    category,
    priority,
    startDate,
    endDate,
    reward,
  } = goalForm;

  const [createGoal, { isLoading }] = useCreateGoalMutation();

  const OnChange = (e) => {
    setGoalForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const HandleCreateGoal = async (e) => {
    e.preventDefault();
    try {
      const timezone=Intl.DateTimeFormat().resolvedOptions().timeZone;
      const response = await createGoal({timezone,...goalForm});
      if (response.error) {
        setErrorMessage(response.error.data.error || response.error.error);
        setTimeout(() => {
          setErrorMessage("");
        }, 3000);
      } else {
        console.log(response.data.message);
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
      name === "" &&
      description === "" &&
      status === "" &&
      category === "" &&
      priority === "" &&
      startDate === "" &&
      endDate === "" &&
      reward === ""
    );
  }, [
    name,
    description,
    status,
    category,
    priority,
    startDate,
    endDate,
    reward,
  ]);

  return (
    <section className="GoalFormMainSec">
      <div className="GoalFormMainDiv">
        <form className="GoalFormActualForm" onSubmit={HandleCreateGoal}>
          <div className="TopOfGoalFormDiv">
            <div>
              <p className="CreateGoalTitle title">Create a goal</p>
              <p className="CreateGoalDesc text">
                Set your intentions by creating a clear, focused goal. Define
                what you want to achieve, when, and how important it is—then
                take the first step toward progress and success.
              </p>
            </div>
            <FontAwesomeIcon
              icon={faXmark}
              onClick={() => setAdd(false)}
              className="CloseAddGoalIcon"
            />
          </div>
          <div className="GoalFormAllInputDiv text">
            <div className="NameDescGoalForm">
              <div>
                <label htmlFor="nameId">Goal name</label>
                <br />
                <input
                  type="text"
                  value={name}
                  name="name"
                  onChange={OnChange}
                  id="nameId"
                />
              </div>
              <div>
                <label htmlFor="descId">Goal description</label>
                <br />
                <textarea
                  value={description}
                  className="text"
                  onChange={OnChange}
                  name="description"
                  id="descId"
                ></textarea>
              </div>
            </div>
            <div className="AllOtherAtGoalFormMainDiv">
              <div className="AnyOfTheTwoGoalForm">
                <div>
                  <label htmlFor="statusId">Goal status</label>
                  <br />
                  <select
                    value={status}
                    name="status"
                    onChange={OnChange}
                    id="statusId"
                  >
                    <option value="" disabled selected>
                      Select the status
                    </option>
                    <option value="Not Started">Not Started</option>
                    <option value="In Progress">In Progress</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="priorityId">Goal priority</label>
                  <br />
                  <select
                    value={priority}
                    name="priority"
                    onChange={OnChange}
                    id="priorityId"
                  >
                    <option value="" disabled selected>
                      Select a priority
                    </option>
                    <option value="Very Low Priority">Very Low Priority</option>
                    <option value="Low Priority">Low Priority</option>
                    <option value="Medium Priority">Medium Priority</option>
                    <option value="High Priority">High Priority</option>
                    <option value="Critical Priority">Critical Priority</option>
                  </select>
                </div>
              </div>
              <div className="AnyOfTheTwoGoalForm">
                <div>
                  <label htmlFor="startId">Start date</label>
                  <br />
                  <input
                    type="date"
                    value={startDate}
                    className="text"
                    name="startDate"
                    onChange={OnChange}
                    id="startId"
                  />
                </div>
                <div>
                  <label htmlFor="endId">Finish date</label>
                  <br />
                  <input
                    type="date"
                    value={endDate}
                    name="endDate"
                    className="text"
                    onChange={OnChange}
                    id="endId"
                  />
                </div>
              </div>
              <div className="AnyOfTheTwoGoalForm">
                <div>
                  <label htmlFor="rewardId">Goal reward</label>
                  <br />
                  <input
                    type="text"
                    value={reward}
                    name="reward"
                    onChange={OnChange}
                    id="rewardId"
                  />
                </div>
                <div>
                  <label htmlFor="categoryId">Goal category</label>
                  <br />
                  <input
                    type="text"
                    placeholder="Health,career,education"
                    value={category}
                    name="category"
                    onChange={OnChange}
                    id="categoryId"
                  />
                </div>
              </div>
              <div className="CreateGoalAtForm">
                <button
                  disabled={isUnchanged}
                  className={
                    isUnchanged
                      ? "EditGoalDisabled text"
                      : isLoading
                      ? "CreateGoalLoader"
                      : !isLoading
                      ? "CreateGoalAtFormBtn text"
                      : null
                  }
                >
                  {isLoading ? <img src={Loader} alt="Loading..." /> : "Create"}
                </button>
              </div>
            </div>
          </div>
          <pre className="text">
            {errorMessage !== "" ? errorMessage : null}
          </pre>
        </form>
      </div>
    </section>
  );
}
