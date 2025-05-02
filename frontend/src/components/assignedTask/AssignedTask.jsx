import React, { useEffect } from "react";
import "./assignedTask.css";

import moment from "moment";

import { useGetAssignedQuery } from "../../redux/api/assignTaskApiSlice";

export function AssignedTask() {
  const { refetch, data, isLoading } = useGetAssignedQuery();

  useEffect(() => {
    refetch();
  }, [refetch]);
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
                  <p className="AssignedStatus text">{each.status}</p>
                  <div>
                    <p className="DueAssignedDate text">
                      Due date:
                      <span>{moment(each.dueDate).format("MMMM Do YYYY")}</span>
                    </p>
                    {each.startDate ? (
                      <p className="StartAssignedDate text">
                        Start date:
                        <span>
                          {moment(each.startDate).format("MMMM Do YYYY")}
                        </span>
                      </p>
                    ) : null}
                  </div>
                </div>
                <p className="FirstAssigned AssignTitleAndValue text">
                  Team: <span>{each.teamName}</span>
                </p>
                <p className="AssignTitleAndValue text">
                  Teamtask: <span>{each.teamTaskname}</span>
                </p>
                <p className="LastAssigned AssignTitleAndValue text">
                  Your role: <span>{each.name}</span>
                </p>
                <div className="BottomDivForEachAssign text">
                  <p
                    className={
                      each.status === "Not started"
                        ? "NotStartedStatue"
                        : each.status === "Completed"
                        ? "CompletedStatue"
                        : each.status === "In progress"
                        ? "InProgressStatue"
                        : null
                    }
                  >
                    {each.status}
                  </p>
                  <button>
                    {each.status === "Not started"
                      ? "Start"
                      : each.status === "In progess"
                      ? "Done"
                      : null}
                  </button>
                </div>
              </div>
            ))}
        </div>
      ) : data &&
      data.message ? (
        <div className="NoAssignedTaskMainDiv">
            <p className="text">You have no tasks assigned to you.</p>
        </div>
      ):null}
    </section>
  );
}
