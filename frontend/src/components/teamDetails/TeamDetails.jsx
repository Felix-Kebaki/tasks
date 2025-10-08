import React, { useEffect, useState } from "react";
import "./teamDetails.css";
import { useParams } from "react-router-dom";
import moment from "moment";
import { Link } from "react-router-dom";

import { Loading } from "../loading/Loading";

import { useGetTeamdashboardQuery } from "../../redux/api/teamApiSlice";
import { CreateTeamtask } from "../createTeamtask/CreateTeamtask";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolder } from "@fortawesome/free-solid-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

export function TeamDetails() {
  const param = useParams();
  const [teamId, setTeamId] = useState(null);

  const {
    refetch,
    data: teamDashboard,
    isLoading,
  } = useGetTeamdashboardQuery({ id: param.id });

  const OnClickOfCreateTeamtask = (getid) => {
    setTeamId(getid);
  };

  useEffect(() => {
    refetch();
  }, [refetch, teamId]);

  if (isLoading) {
    return (
      <div className="MainLoaderDiv">
        <Loading />
      </div>
    );
  }

  return (
    <section className="TeamDetailsMainSec">
      <div className="TeamDetailsMainDiv">
        <div className="TeamDetailTopDiv">
          <p className="TeamName title">{teamDashboard?.name}</p>
          <p className="DateOfTeamCreation text">
            Created on {moment(teamDashboard?.createdAt).format("Do MMM 'YY")} by {teamDashboard?.admin[0]} {teamDashboard?.admin[1]} 
          </p>
        </div>

        <div className="TeamtaskAndGraphMainWrapper">
          {teamDashboard?.teamtask.length === 0 && !teamDashboard?.isAdmin ? (
            <div className="NoTeamtaskMainDiv">
              <p className="text">
                The admin hasn't created any Teamtask yet. You will be notified
                when that happens.
              </p>
            </div>
          ) : teamDashboard?.teamtask.length === 0 && teamDashboard?.isAdmin ? (
            <div className="NoTeamtaskAdminMainDiv">
              <div className="TeamtaskMainTitleDiv">
                <p className="TeamtaskMainTitle title">Teamtasks</p>
                <p className="TeamTaskLengthMain text">
                  {teamDashboard?.teamtask.length}
                </p>
              </div>
              <div className="TeamtaskCreateOneAndFewInfoMainDiv">
                <div
                  className="CreateTeamtaskMainDiv"
                  onClick={() => OnClickOfCreateTeamtask(param.id)}
                >
                  <FontAwesomeIcon
                    icon={faFolder}
                    className="CreateTeamtaskFolderIcon"
                  />
                  <p className="TeamtaskCreateText text">
                    <FontAwesomeIcon
                      icon={faPlus}
                      className="CreateTeamtaskplusIcon"
                    />
                    Create Teamtask.
                  </p>
                </div>
                <div className="FewInfoOnCreatingTeamtaskDiv">
                  <p className="title">About Team Tasks</p>
                  <div className="text">
                    <p>
                      1. Create and manage tasks for your team in one place.
                    </p>
                    <p>
                      2. Assign specific members to handle individual
                      responsibilities.
                    </p>
                    <p>3. Track each member’s task progress and submissions.</p>
                    <p>4. Monitor overall task completion and performance.</p>
                    <p>
                      5. Manage multiple team tasks under the same team for
                      better organization.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="TeamTaskAndGraphMainDiv">
              <div className="TeamtaskMainDivAtTeamDetails">
                <div className="TeamtaskMainTitleDiv">
                  <p className="TeamtaskMainTitle title">Teamtasks</p>
                  <p className="TeamTaskLengthMain text">
                    {teamDashboard?.teamtask.length}
                  </p>
                </div>
                <div className="TeamtasksAtTeamDashDivWrapper">
                  {teamDashboard?.teamtask.map((task) => (
                    <Link
                      key={task._id}
                      className="TeamtaskTeamDashEachtaskdiv"
                      to={"/app/teams/eachTeam/eachTeamtask/"+task._id}
                    >
                      <div className="TopEachTeamtaskTeamDash text">
                        <p>
                          Due:{" "}
                          <span>
                            {moment(task.dueDate).format("DD MMM 'YY")}
                          </span>
                        </p>
                      </div>
                      <div className="EachTeamtaskFolderAndTaskName">
                        <FontAwesomeIcon
                          icon={faFolder}
                          className="EachTeamtaskFolderIcon"
                        />
                        <p className="text">{task.name}</p>
                      </div>
                    </Link>
                  ))}
                  <div
                    className="CreateTeamtaskWithExistingTaskDiv"
                    onClick={() => OnClickOfCreateTeamtask(param.id)}
                  >
                    <FontAwesomeIcon
                      icon={faFolder}
                      className="CreateTeamtaskFolderIconwithTasks"
                    />
                    <p className="CreateTeamtaskTextWithTasks text">
                      <FontAwesomeIcon
                        icon={faPlus}
                        className="CreateTeamtaskplusIconWithTasks"
                      />
                      Create Teamtask.
                    </p>
                  </div>
                </div>
              </div>
              <div className="GraphOnTeamDashboardMainDiv"></div>
            </div>
          )}
        </div>

        <div className="MembersTableMainDivWrapper">
          <div className="MembersTableMainTitleDiv title">
            <p className="MembersTableMainTitle">Members</p>
            <p className="MembersTableMainLength text">
              {teamDashboard?.members.length}
            </p>
          </div>
          <table border="1" cellSpacing="0" className="MembersTableMainDiv">
            <thead>
              <tr className="MemberTableHeadingRow text">
                <th>Name</th>
                <th>Email</th>
                <th>Admin</th>
                <th>Tasks assigned</th>
                <th>Tasks completed</th>
                <th>Submissions</th>
                {teamDashboard?.isAdmin ? <th>Last active</th> : null}
              </tr>
            </thead>
            <tbody>
              {teamDashboard?.members.map((member) => (
                <tr className="MembersTableDetailsRow text" key={member.email}>
                  <td>
                    {member.firstName} {member.lastName}
                  </td>
                  <td>{member.email}</td>
                  <td
                    className={
                      member.email === teamDashboard.admin[2]
                        ? "AdminTextColor"
                        : "NotAdminTextColor"
                    }
                  >
                    {member.email === teamDashboard.admin[2] ? "Yes" : "No"}
                  </td>
                  <td>{member.assignedTasks}</td>
                  <td>{member.completeTasks}</td>
                  <td>{member.submissions}</td>
                  {teamDashboard?.isAdmin ? (
                    <td
                      className={
                        member.active !== undefined
                          ? "ActiveOnLastLogged"
                          : "NotActiveOnLastLogged"
                      }
                    >
                      {member.active !== undefined
                        ? member.active
                        : moment(member.loggedOut).isSame(moment(), "day")
                        ? moment(member.loggedOut).format("HH:mm")
                        : moment(member.loggedOut).format("DD MMM")}
                    </td>
                  ) : null}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {teamId !== null ? (
          <div className="OverflowAddMainDiv">
            <CreateTeamtask setAdd={setTeamId} add={teamId} />
          </div>
        ) : null}
      </div>
    </section>
  );
}
