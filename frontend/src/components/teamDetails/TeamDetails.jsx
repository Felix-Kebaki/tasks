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
    console.log(teamDashboard);
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
          <div className="TeamInfoMainDiv">
            <p className="TeamName title">{teamDashboard?.name}</p>
            <div className="text">
              <p>
                Admin:
                <span>
                  {teamDashboard?.admin[0]} {teamDashboard?.admin[1]}{" "}
                  {teamDashboard?.admin[2]}
                </span>
              </p>
              <p>
                Created on:
                <span>{moment(teamDashboard?.createdAt).format("MMMM Do YYYY")}</span>
              </p>
              <p>Total members: <span>{teamDashboard?.members.length}</span></p>
              <p>Total Teamtasks: <span>{teamDashboard?.teamtask.length}</span></p>
            </div>
          </div>
          <div className="TeamMembersMainDiv">
            <p className="TeamMembersMainTitle title">
              Members<span>{teamDashboard?.members.length}</span>
            </p>
            <div className="TeamMembersInsideDiv">
            {teamDashboard?.members.map((member, i) => (
              <div key={i} className="EachMemberDiv text">
                <div className="TeamMembersProfileDiv">{member.firstName.charAt(0).toUpperCase()}{member.lastName.charAt(0).toUpperCase()}</div>
                <p>{member.firstName}</p>
                <p>{member.lastName}</p>
              </div>
            ))}
            </div>
          </div>
          <div className="TeamRecentActivitiesMainDiv"></div>
        </div>
      </div>
    </section>
  );
}
