import React, { useEffect, useState } from "react";
import "./teamDetails.css";
import { useParams } from "react-router-dom";
import moment from "moment";

import { Loading } from "../loading/Loading";

import { useGetTeamdashboardQuery } from "../../redux/api/teamApiSlice";

export function TeamDetails() {
  const param = useParams();

  const {
    refetch,
    data: teamDashboard,
    isLoading,
  } = useGetTeamdashboardQuery({ id: param.id });

  useEffect(() => {
    refetch();
  }, [refetch]);

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
          <p className="DateOfTeamCreation text">Created on {moment(teamDashboard?.createdAt).format("YYYY Do MMMM")}</p>
        </div>

    {

    }

        <div className="MembersTableMainDivWrapper">
          <p className="MembersTableMainTitle title">Members</p>
          <table border="1" cellSpacing="0" className="MembersTableMainDiv">
            <thead>
              <tr className="MemberTableHeadingRow text">
                <th>Name</th>
                <th>Email</th>
                <th>Admin</th>
                <th>Tasks assigned</th>
                <th>Tasks completed</th>
                <th>Submissions</th>
                {teamDashboard.isAdmin ? <th>Last active</th> : null}
              </tr>
            </thead>
            <tbody>
              {teamDashboard?.members.map((member) => (
                <tr className="MembersTableDetailsRow text" key={member.email}>
                  <td>
                    {member.firstName} {member.lastName}
                  </td>
                  <td>{member.email}</td>
                  <td className={member.email===teamDashboard.admin[2]?"AdminTextColor":"NotAdminTextColor"}>{member.email === teamDashboard.admin[2]?"Yes":"No"}</td>
                  <td>{member.assignedTasks}</td>
                  <td>{member.completeTasks}</td>
                  <td>{member.submissions}</td>
                  {teamDashboard.isAdmin ? (
                    <td className={member.active!==undefined?"ActiveOnLastLogged":"NotActiveOnLastLogged"}>
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
      </div>
    </section>
  );
}
