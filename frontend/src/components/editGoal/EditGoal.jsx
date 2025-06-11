import React, { useState, useEffect, useMemo } from "react";
import moment from "moment";
import "./editGoal.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import { useSingleGoalQuery } from "../../redux/api/goalApiSlice";
import { useEditGoalMutation } from "../../redux/api/goalApiSlice";

import Loader from "../../assets/images/blackLoader.png";
import { Loading } from "../loading/Loading";

export function EditGoal({ edit, setEdit }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [category, setCategory] = useState("");
  const [reward, setReward] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const { refetch, data, isLoading } = useSingleGoalQuery({ goalId: edit });
  const [editGoal, { isLoading: editLoading }] = useEditGoalMutation();

  const HandleSubmitEdit = async (e) => {
    e.preventDefault();
    try {
      const res = await editGoal({
        data: {
          name:name!==data?.name?name:undefined,
          description:description!==data?.description?description:undefined,
          status:status!==data?.status?status:undefined,
          priority:priority!==data?.priority?priority:undefined,
          startDate:startDate!==moment(data?.startDate).format("YYYY-MM-DD")?startDate:undefined,
          endDate:endDate!==moment(data?.endDate).format("YYYY-MM-DD")?endDate:undefined,
          category:category!==data?.category?category:undefined,
          reward:reward!==data?.reward?reward:undefined
        },
        id: edit,
      });
      if (res.error) {
        setErrorMessage(res.error.data.error || res.error.error);
        setTimeout(() => {
          setErrorMessage("");
        }, 3000);
      } else {
        console.log(res.data.message);
        setEdit(null);
      }
    } catch (error) {
      console.error(error.message);
      setErrorMessage(error.message || error);
      setTimeout(() => {
        setErrorMessage("");
      }, 3000);
    }
  };

  useEffect(() => {
    refetch();
  }, []);

  const isUnchanged = useMemo(() => {
    return (
      name === data?.name &&
      description === data?.description &&
      status === data?.status &&
      priority === data?.priority &&
      startDate === moment(data?.startDate).format("YYYY-MM-DD") &&
      endDate === moment(data?.endDate).format("YYYY-MM-DD") &&
      category === data?.category &&
      reward === data?.reward &&
      !editLoading
    );
  }, [
    name,
    description,
    status,
    priority,
    startDate,
    endDate,
    category,
    reward,
  ]);

  useEffect(() => {
    if (data) {
      setName(data.name || "");
      setDescription(data.description || "");
      setPriority(data.priority || "");
      setStatus(data.status || "");
      setReward(data.reward || "");
      setCategory(data.category || "");
      setStartDate(moment(data.startDate).format("YYYY-MM-DD") || "");
      setEndDate(moment(data.endDate).format("YYYY-MM-DD") || "");
    }
  }, [data]);

  if (isLoading || !data) {
    return (
      <div className="MainLoaderDiv">
        <Loading />
      </div>
    );
  }

  return (
    <section className="EditGoalMainSec">
      <form className="EditGoalMainForm" onSubmit={HandleSubmitEdit}>
        <div className="EditGoalTopDiv">
          <p className="title">Edit your goal</p>
          <FontAwesomeIcon
            icon={faXmark}
            onClick={() => setEdit(null)}
            className="EditGoalExitIcon"
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
                onChange={(e) => setName(e.target.value)}
                id="nameId"
              />
            </div>
            <div>
              <label htmlFor="descId">Goal description</label>
              <br />
              <textarea
                value={description}
                className="text"
                onChange={(e) => setDescription(e.target.value)}
                id="descId"
              ></textarea>
            </div>
          </div>
          <div className="AllOtherAtGoalFormMainDiv">
            <div className="AnyOfTheTwoGoalForm">
              <div>
                <label htmlFor="statusId">Goal status</label>
                <br />
                {status === "In Progress" ? (
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    id="statusId"
                  >
                     <option value="In Progress">In Progress</option>
                    <option value="Paused">Pause</option>
                    <option value="Completed">Complete</option>
                  </select>
                ) : status === "Not Started" ? (
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    id="statusId"
                  >
                    <option value="Not Started">Not Started</option>
                    <option value="In Progress">In Progress</option>
                  </select>
                ) : status === "Out of Time" ? (
                  <select value={status} id="statusId">
                    <option value="Out of Time">Out of Time</option>
                  </select>
                ) : status === "Paused" ? (
                  <select value={status} id="statusId">
                    <option value="Paused">Paused</option>
                    <option value="In Progress">Resume</option>
                  </select>
                ) : null}
              </div>
              <div>
                <label htmlFor="priorityId">Goal priority</label>
                <br />
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
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
                  onChange={(e) => setStartDate(e.target.value)}
                  id="startId"
                />
              </div>
              <div>
                <label htmlFor="endId">Finish date</label>
                <br />
                <input
                  type="date"
                  value={endDate}
                  className="text"
                  onChange={(e) => setEndDate(e.target.value)}
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
                  onChange={(e) => setReward(e.target.value)}
                  id="rewardId"
                />
              </div>
              <div>
                <label htmlFor="categoryId">Goal category</label>
                <br />
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  id="categoryId"
                />
              </div>
            </div>
            <div className="CreateGoalAtForm">
              <button
                type="submit"
                disabled={isUnchanged}
                className={
                  isUnchanged
                    ? "EditGoalDisabled text"
                    : editLoading
                    ? "EditGoalLoader"
                    : !editLoading
                    ? "EditGoalAtFormBtn text"
                    : null
                }
              >
                {editLoading ? <img src={Loader} alt="Loading..." /> : "Update"}
              </button>
            </div>
          </div>
        </div>
        <pre className="text">{errorMessage !== "" ? errorMessage : null}</pre>
      </form>
    </section>
  );
}
