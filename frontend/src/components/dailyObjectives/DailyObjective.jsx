import React, { useEffect, useState } from "react";
import "./dailyObjectives.css";
import "../../index.css";
import { ObjectiveForm } from "../createObjective/ObjectiveForm";
import { ObjectiveConfirm } from "../confirm/ObjectiveConfirm";
import { Loading } from "../loading/Loading";

import { useGetObjectivesQuery } from "../../redux/api/todayApiSlice";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { faAnglesRight } from "@fortawesome/free-solid-svg-icons";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";

export function DailyObjective() {
  const { refetch, data: objectives, isLoading } = useGetObjectivesQuery();
  const [add, setAdd] = useState(false);
  const [confirm, setConfirm] = useState(null);
  const [msg, setMsg] = useState("");
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const HandleAddObjective = () => {
    setAdd(true);
  };

  const HandleDoneClick = (id, outOftime) => {
    if (outOftime) {
      return null;
    } else {
      setConfirm(id);
      setMsg("marked as done");
    }
  };

  const HandleClickDelete = (id) => {
    setConfirm(id);
    setMsg("removed");
  };

  useEffect(() => {
    refetch();
  }, [refetch, add, confirm]);

  if (isLoading) {
    return (
      <div className="MainLoaderDiv">
        <Loading />
      </div>
    );
  }
  return (
    <section className="DailyObjectivesMainSec">
      <div className="DailyObjectivesMainDiv">
        <p className="TodayMainTitle title">Today's Objectives</p>
        <p className="TodayDate text">
          {String(new Date().getDate()).padStart(2, "0")}-
          {String(new Date().getMonth() + 1).padStart(2, "0")}-
          {new Date().getFullYear()}, {daysOfWeek[new Date().getDay()]}
        </p>

        <div className="DailyObjectiveStartMainDiv">
          {objectives &&
            objectives.map((obj) => (
              <div key={obj._id} className="OnlyObjectivesMainDiv">
                <div className="ObjectiveMarkMainDiv">
                  <div
                    onClick={() => HandleDoneClick(obj._id, obj.outOfTime)}
                    className={
                      obj.outOfTime
                        ? "ObjectiveMarkDiv ObjectiveMarkDivOutOfTime"
                        : obj.objectiveDone
                        ? "ObjectiveMarkDiv ObjectiveMarkDivDone"
                        : "ObjectiveMarkDiv"
                    }
                  >
                    {obj.outOfTime ? (
                      <FontAwesomeIcon icon={faXmark} />
                    ) : obj.objectiveDone ? (
                      <FontAwesomeIcon icon={faCheck} />
                    ) : null}
                  </div>
                  <p className="ActualObjective text">{obj.objective}</p>
                </div>
                <div className="ObjectiveBottomMainDiv">
                  {obj.outOfTime ? (
                    <p className="OutOfTimeText text">Out of time</p>
                  ) : obj.startTime && obj.endTime ? (
                    <div className="ObjectiveTimeDiv text">
                      <p>{obj.startTime}</p>
                      <FontAwesomeIcon
                        icon={faAnglesRight}
                        id="TimeArrowObjectives"
                      />
                      <p>{obj.endTime}</p>
                    </div>
                  ) : null}
                  <div className="CategoryAndDeleteObjectiveDiv">
                    <p className="text">
                      Category: <span>{obj.category}</span>
                    </p>
                    {!obj.objectiveDone ? (
                      <FontAwesomeIcon
                        icon={faTrashCan}
                        className="DeleteObjectiveIcon"
                        onClick={() => HandleClickDelete(obj._id)}
                      />
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          <div className="AddTaskButton text" onClick={HandleAddObjective}>
            <FontAwesomeIcon icon={faPlus} id="PlusObjective" /> Add Objective
          </div>
        </div>
        {add ? (
          <div className="OverflowAddMainDiv">
            <ObjectiveForm setAdd={setAdd} />
          </div>
        ) : null}

        {confirm !== null ? (
          <div className="OverflowAddMainDiv">
            <ObjectiveConfirm
              setConfirm={setConfirm}
              msg={msg}
              setMsg={setMsg}
              confirm={confirm}
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}
