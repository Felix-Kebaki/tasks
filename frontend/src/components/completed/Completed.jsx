import React, { useEffect } from "react";
import moment from "moment";

import { useToast } from "../../context/ToastContext";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

import { useGetCompleteQuery } from "../../redux/api/goalApiSlice";
import { useDeleteGoalMutation } from "../../redux/api/goalApiSlice";

import "./completed.css";
import { Loading } from "../loading/Loading";

export function Completed() {
  const { refetch, data: completed, isLoading } = useGetCompleteQuery();
  const [deleteGoal] = useDeleteGoalMutation();
  const {showToast}=useToast()

  const HandleClickOnDelete = async (id) => {
    try {
      const response = await deleteGoal(id);
      if (response.error) {
        console.log(response.error.data.error || response.error.error);
        showToast(response.error.data.error || response.error.error,"error")
      } else {
        showToast(response.data.message,"success");
        refetch();
      }
    } catch (error) {
      console.error(error.message||error);
      showToast(error.message||error,"error")
    }
  };

  useEffect(() => {
    refetch();
  }, [refetch, completed]);

  if(isLoading){
    return(
      <div className="MainLoaderDiv">
        <Loading/>
      </div>
    )
  }

  return (
    <section className="CompletedMainSec">
      {completed && completed.length == 0 ? (
        <div className="NoCompletedGoalMainDiv">
          <p className="text">You have no completed goal</p>
        </div>
      ) : (
        <>
          <div className="CompletedTopDiv">
            <p className="title">Completed Objectives</p>
          </div>
          <div className="CompleteEachDivWrapperDiv">
            {completed &&
              completed.map((complete) => (
                <div key={complete._id} className="EachCompletedDiv">
                  <div>
                    <div className="topOfEachCompGoalDiv">
                      <div className="EachCompStatusAndPriorityDiv">
                        <p className="priorityP text">{complete.status}</p>
                      </div>
                      <div className="GoalDelEditDoneDiv">
                        <FontAwesomeIcon
                          icon={faTrashCan}
                          className="DeleteGoalIcon"
                          onClick={() => HandleClickOnDelete(complete._id)}
                        />
                      </div>
                    </div>
                    <p className="GoalName title">{complete.name}</p>
                    <p className="GoalDesc text">
                      <span className="RewardMainTitle title">Reward:</span>{" "}
                      {complete.reward}
                    </p>
                  </div>
                  <div className="DateOfGoalsDiv">
                    <div>
                      <p className="dateTitle text">Date completed:</p>
                      <p className="dateActual text">
                        {moment(complete.dayCompleted).format("MMM Do YYYY")}
                      </p>
                    </div>
                    <div>
                      <p className="dateTitle text">Duration:</p>
                      <p className="dateActual text">
                        {complete.duration.days !== "0"
                          ? complete.duration.days +
                            " days," +
                            complete.duration.hours +
                            " hrs"
                          : complete.duration.hours +
                            " hrs," +
                            complete.duration.minutes +
                            " min"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </>
      )}
    </section>
  );
}
