import React, { useEffect, useState } from "react";
import "./assignedTask.css";

import moment from "moment";

import { SumbitYouWork } from "../submitYourWork/SumbitYouWork";
import { Loading } from "../loading/Loading";

import { useGetAssignedQuery } from "../../redux/api/assignTaskApiSlice";
import { useStartTeamtaskMutation } from "../../redux/api/assignTaskApiSlice";
import { useMarkAsDoneMutation } from "../../redux/api/assignTaskApiSlice";

export function AssignedTask() {
  const [submit, setSubmit] = useState(null);

  const { refetch, data, isLoading } = useGetAssignedQuery();
  const [markAsDone] = useMarkAsDoneMutation();
  const [startTeamtask] = useStartTeamtaskMutation();

  const HandleClickOnStartTeamtask = async (taskId) => {
    try {
      const res = await startTeamtask({ taskId });
      if (res.error) {
        console.error(res.error.data.error || res.error.error);
      } else {
        console.log(res.data.message);
        refetch();
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const HandleClickOnDoneTeamtask = async (teamtaskId) => {
    setSubmit(teamtaskId);
    try {
      const res = await markAsDone({ teamtaskId });
      if (res.error) {
        console.error(res.error.data.error || res.error.error);
      } else {
        console.log(res.data.message);
        refetch();
      }
    } catch (error) {
      console.error(error.message || error);
    }
  };

  useEffect(() => {
    refetch();
  }, [refetch, submit]);

  if (isLoading) {
    return (
      <div className="MainLoaderDiv">
        <Loading />
      </div>
    );
  }
  return (
    <section className="AssignedTaskMainSec">
      <div className="AssigneTaskActualMainDiv">
        <p className="YourAssignedTaskTitle title">Your Tasks</p>
      </div>
      {data && data.Assigned && data.Assigned.length !== 0 ? (
        <div className="AssignedTaskMainDiv">
          {data &&
            data.Assigned &&
            data.Assigned.map((each) => (
              <div key={each._id} className="EachAssignedTaskDiv">
                <div className="TopEachAssignedDiv">
                  <div className="StartAssignedDate text">
                    <p>Start date:</p>
                    <span>{moment(each.startDate).format("MMMM Do YYYY")}</span>
                  </div>
                  <div className="DueAssignedDate text">
                    <p>Due date:</p>
                    <span>{moment(each.dueDate).format("MMMM Do YYYY")}</span>
                  </div>
                </div>
                <p className="TeamtaskTitleOnly title">
                    {each.teamTaskname}
                </p>
                <p className="AssignTitleAndValue title">
                  Your role: <span className="text">{each.name}</span>
                </p>
                <div className="BottomDivForEachAssign text">
                  <p
                    className={
                      each.status === "Not Started"
                        ? "AssignedStatusNotStarted text"
                        : each.status === "In Progress"
                        ? "AssignedStatusInProgress"
                        : each.status === "Completed"
                        ? "AssignedStatusCompleted"
                        : each.status === "Out of Time"
                        ? "AssignedStatusOutOfTime"
                        : null
                    }
                  >
                    {each.status}
                  </p>
                  {each.status !== "Completed" ? (
                    <button
                      onClick={
                        each.status === "Not Started"
                          ? () => HandleClickOnStartTeamtask(each._id)
                          : each.status === "In Progress"
                          ? () => HandleClickOnDoneTeamtask(each._id)
                          : null
                      }
                      className={
                        (each.status === "Completed" ||  each.status==="Out of Time")
                          ? "BottomDivForEachAssignDelete"
                          :(each.status==="Not Started" || each.status==="In Progress")? "AssignedInProgressAndNotStartedBtn":null
                      }
                    >
                      {each.status === "Not Started"
                        ? "Start"
                        : each.status === "In Progress"
                        ? "Done"
                        : null}
                    </button>
                  ) : null}
                </div>
              </div>
            ))}
        </div>
      ) : data && data.message ? (
        <div className="NoAssignedTaskMainDiv">
          <p className="text">You have no tasks assigned to you.</p>
        </div>
      ) : null}
      {submit !== null ? (
        <div className="OverflowAddMainDiv">
          <SumbitYouWork submit={submit} setSubmit={setSubmit} />
        </div>
      ) : null}
    </section>
  );
}
