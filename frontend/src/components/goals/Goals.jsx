import React, { useState, useEffect } from "react";
import moment from "moment";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { faSquareCheck } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";

import { useGetAllQuery } from "../../redux/api/goalApiSlice";
import { useStartGoalMutation } from "../../redux/api/goalApiSlice";
import { usePauseGoalMutation } from "../../redux/api/goalApiSlice";
import { useResumeGoalMutation } from "../../redux/api/goalApiSlice";

import { GoalForm } from "../createGoal/GoalForm";
import { ObjectiveConfirm } from "../confirm/ObjectiveConfirm";
import { Loading } from "../loading/Loading";
import { EditGoal } from "../editGoal/EditGoal";

import "./goals.css";
import "../../index.css";

export function Goals() {
  const { refetch, data: goals, isLoading } = useGetAllQuery();
  const [startGoal] = useStartGoalMutation();
  const [pauseGoal] = usePauseGoalMutation();
  const [resumeGoal] = useResumeGoalMutation();

  const [add, setAdd] = useState(false);
  const [confirm, setConfirm] = useState(null);
  const [msg, setMsg] = useState("");
  const [edit, setEdit] = useState(null);

  const HandleClickOnAdd = () => {
    setAdd(true);
  };

  const HandleClickOnDelete = (id) => {
    setConfirm(id);
    setMsg("deleted");
  };

  const HandleClickOnEdit = (goalId) => {
    setEdit(goalId)
  };

  const HandleClickStart = async (id) => {
    try {
      const response = await startGoal(id);
      if (response.error) {
        console.error(response.error.data.error || response.error.error);
      } else {
        console.log(response.data.message);
        refetch();
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const HandleClickOnPause = async (id) => {
    try {
      const response = await pauseGoal(id);
      if (response.error) {
        console.error(response.error.data.error || response.error.error);
      } else {
        console.log(response.data.message);
        refetch();
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const HandleClickOnResume = async (id) => {
    try {
      const response = await resumeGoal(id);
      if (response.error) {
        console.error(response.error.data.error || response.error.error);
      } else {
        console.log(response.data.message);
        refetch();
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const HandleClickOnComplete = (id) => {
    setMsg("marked as complete");
    setConfirm(id);
  };

  useEffect(() => {
    refetch();
  }, [refetch, add, confirm,edit]);

  if (isLoading) {
    return (
      <div className="MainLoaderDiv">
        <Loading />
      </div>
    );
  }

  return (
    <section className="GoalsMainSec">
      <div className="TopDivInGoalsPage">
        <p className="title">Goals</p>
        <button className="text" onClick={HandleClickOnAdd}>
          <FontAwesomeIcon icon={faPlus} /> Create Goal
        </button>
      </div>
      <div className="GoalsMainDiv">
        {goals && goals.length !== 0 ? (
          goals.map((goal) => (
            <div className="EachGoalDiv" key={goal._id}>
              <div className="topOfEachGoalDiv">
                <div>
                  <p className="statusP text">{goal.status}</p>
                  <p className="priorityP text">{goal.priority}</p>
                </div>
                <p className="GoalName title">{goal.name}</p>
                <p className="GoalDesc text">{goal.description}</p>
              </div>
              <div>
                <div className="DateOfGoalsDiv">
                  <div>
                    <p className="dateTitle text">Start date:</p>
                    <p className="dateActual text">
                      {moment(goal.startDate).format("MMMM Do YYYY")}
                    </p>
                  </div>
                  <div>
                    <p className="dateTitle text">Due date:</p>
                    <p className="dateActual text">
                      {moment(goal.endDate).format("MMMM Do YYYY")}
                    </p>
                  </div>
                </div>
                <div className="BottomPartOfGoalDiv">
                  {goal.status === "Not Started" ? (
                    <div className="BottomGoalLotOfOptions">
                      <button onClick={() => HandleClickStart(goal._id)} className="StartBorderBtn">
                        Start
                      </button>
                    </div>
                  ) : goal.status === "Paused" ? (
                    <div className="BottomGoalLotOfOptions">
                      <button onClick={() => HandleClickOnResume(goal._id)} className="StartBorderBtn">
                        Resume
                      </button>
                    </div>
                  ) : goal.status === "In Progress" ? (
                    <div className="BottomGoalLotOfOptions">
                      <button onClick={() => HandleClickOnPause(goal._id)} className="StartBorderBtn">
                        Pause
                      </button>
                    </div>
                  ) : goal.status === "Out of Time" ? (
                    <div className="BottomGoalLotOfOptions">
                      <p className="title">Out of time</p>
                    </div>
                  ) : null}
                  <div className="GoalDelEditDoneDiv">
                    {goal.status !== "Not Started" &&
                    goal.status !== "Out of Time" ? (
                      <FontAwesomeIcon
                        icon={faSquareCheck}
                        className="DoneIconGoal"
                        onClick={() => HandleClickOnComplete(goal._id)}
                      />
                    ) : null}
                    <FontAwesomeIcon
                      icon={faPenToSquare}
                      className="EditGoalIcon"
                      onClick={() => HandleClickOnEdit(goal._id)}
                    />
                    <FontAwesomeIcon
                      icon={faTrash}
                      className="DeleteGoalIcon"
                      onClick={() => HandleClickOnDelete(goal._id)}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="NoGoalMainDiv">
            <p className="text">You have not created any goal so far</p>
          </div>
        )}
        {add ? (
          <div className="OverflowAddMainDiv">
            <GoalForm setAdd={setAdd} />
          </div>
        ) : null}

        {confirm !== null ? (
          <div className="OverflowAddMainDiv">
            <ObjectiveConfirm
              setConfirm={setConfirm}
              confirm={confirm}
              setMsg={setMsg}
              msg={msg}
            />
          </div>
        ) : null}

        {edit !== null ? (
          <div className="OverflowAddMainDiv">
            <EditGoal edit={edit} setEdit={setEdit} />
          </div>
        ) : null}
      </div>
    </section>
  );
}
