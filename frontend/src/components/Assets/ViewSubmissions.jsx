import React, { useEffect } from "react";
import "./viewSubmissions.css";

import { useParams } from "react-router-dom";

import { useGetSubmissionsQuery } from "../../redux/api/teamTaskApiSlice";

import {Loading} from '../loading/Loading'

export function ViewSubmissions() {
  const param = useParams();
  const { refetch, data, isLoading } = useGetSubmissionsQuery({
    teamtaskId: param.teamtaskId,
  });
  useEffect(() => {
    refetch();
  }, [refetch]);

  if(isLoading){
    return(
      <div className="MainLoaderDiv">
        <Loading/>
      </div>
    )
  }
  return (
    <section className="TeamSubmissionsMainSec">
      <div className="TeamSubmissionsMainDiv">
        <p className="TeamSubmissionMainTitle title">Teamtask Submissions</p>
        <div className="TeamSubmissionsMainDivWrapper">
          {data?.submissions?.length !== 0 ? (
            data?.submissions?.map((each) => (
              <a
                href={each.fileUrl}
                key={each.fileUrl}
                className="EachTeamSubmissionsDiv"
                target="_blank"
                rel="noopener noreferrer"
              >
                <p className="TeamSubmitType text">{each.fileType==="Link"?"Visit":"View"} {each.fileType}</p>
                <p className="TeamSubmittedBy text">
                  Submitted by:
                  <span>
                    {each.submittedBy.firstName} {each.submittedBy.lastName}
                  </span>
                </p>
              </a>
            ))
          ) : (
            <div className="NoSubmissionsMadeDiv">
              <p className="text">No submissions made yet</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
