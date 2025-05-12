import React, { useEffect } from "react";
import "./allPerCategory.css";

import { useGetAllPerCatQuery } from "../../redux/api/allCategoryApiSlice";

import { useParams } from "react-router-dom";
import moment from "moment";

export function AllPerCategory() {
  const params = useParams();

  const { refetch, data, isLoading } = useGetAllPerCatQuery({
    categoryName: params.categoryName,
  });

  const getCurrentTime = (startTime, endTime) => {
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5);
    if (startTime > currentTime) {
      //not started
      return true;
    } else if (currentTime > startTime && endTime > currentTime) {
      //in progress
      return false;
    } else if (currentTime > endTime) {
      //out of time
      return "OutOfTime";
    }
  };

  useEffect(() => {
    refetch();
    getCurrentTime();
    console.log(data);
  }, [refetch]);

  return (
    <section className="AllPerCategoryMainSec">
      <div className="AllPerCategoryMainDiv">
        <p className="AllPerCatMainTitle title">
          Category /<span>{params.categoryName}</span>
        </p>
        {data?.daily?.length !== 0 ? (
          <div className="TodayAndGoalMainDivWrapper">
            <p className="TodayAndGoalTitle text">Today</p>
            <div className="EachTodayAndGoalWrapperDiv">
              {data?.daily?.map((today) => (
                <div key={today._id} className="EachTodayAllPerCatDiv">
                  <div>
                    <p
                      className={
                        today.objectiveDone
                          ? "DoneObjectiveAtCatP text"
                          : getCurrentTime(today.startTime, today.endTime) ===
                            true
                          ? "NotStartedP text"
                          : getCurrentTime(today.startTime, today.endTime) ===
                            false
                          ? "InProgressP text"
                          : getCurrentTime(today.startTime, today.endTime) ===
                            "OutOfTime"
                          ? "OutofTimeP text"
                          : null
                      }
                    >
                      {today.objectiveDone
                        ? "Done"
                        : getCurrentTime(today.startTime, today.endTime) ===
                          true
                        ? "Not Started"
                        : getCurrentTime(today.startTime, today.endTime) ===
                          false
                        ? "In Progress"
                        : getCurrentTime(today.startTime, today.endTime) ===
                          "OutOfTime"
                        ? "Out of Time"
                        : null}
                    </p>
                    <p className="ObjectiveTextAtCategory text">
                      {today.objective}
                    </p>
                  </div>
                  <div>
                    <div className="StartAndStopTimeAsCategoryDiv">
                      <p className="text">
                        Start: <span>{today.startTime}</span>
                      </p>
                      <p className="text">
                        Stop: <span>{today.endTime}</span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
        {data?.goals?.length !== 0 ? (
          <div className="TodayAndGoalMainDivWrapper">
            <p className="TodayAndGoalTitle OnlyGoalForMargin text">Goals</p>
            <div className="EachTodayAndGoalWrapperDiv">
              {data?.goals?.map((goal) => (
                <div key={goal._id} className="EachGoalAllPerCatDiv">
                  <div>
                    <div className="EachGoalAllPerCatTopDiv">
                      <p
                        className={
                          goal.status === "Paused" ||
                          goal.status === "Out of Time"
                            ? "PausedAndOutOfTimeStatusColor  text"
                            : goal.status === "Completed"
                            ? "CompletedStatusGoalColor text"
                            : goal.status === "In Progress"
                            ? "InProgressGoalColor text"
                            : goal.status === "Not Started"
                            ? "NotStartedGoalColor text"
                            : null
                        }
                      >
                        {goal.status}
                      </p>
                      {goal.status === "Completed" ? (
                        <p className="DurationEachGoalPerCat text">
                          Duration :
                          <span>
                            {goal.duration.days !== "0"
                              ? goal.duration.days + " days,"+goal.duration.hours+" hrs"
                              : 
                              goal.duration.hours+" hrs,"+goal.duration.minutes+ " min"}
                          </span>
                        </p>
                      ) : goal.status === "Out of Time" ? null : (
                        <p className="EachGoalAtAllCatPrority text">
                          {goal.priority}
                        </p>
                      )}
                    </div>
                    <p className="EachGoalNameAtAllPerCat text">{goal.name}</p>
                    <p className="EachGoalDescAtAllPerCat text">
                      {goal.description}
                    </p>
                  </div>
                  <div className="StartAndDueDateOfGoalsPerCatDiv">
                    <div className="text">
                      <p>Start date:</p>
                      <p>{moment(goal.startDate).format("MMMM Do YYYY")}</p>
                    </div>
                    <div className="text">
                      <p>Due date:</p>
                      <p>{moment(goal.endDate).format("MMMM Do YYYY")}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
