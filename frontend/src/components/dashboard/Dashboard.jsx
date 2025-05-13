import { useEffect, useState } from "react";
import "./dashboard.css";

import { Charts } from "./Charts";
import { LineGraph } from "./LineGraph";

import { useSelector } from "react-redux";

import {
  useGetEachLengthQuery,
  useAsPerPriorityQuery,
  useAsPerStatusQuery,
  useGetMonthlyUsageQuery,
} from "../../redux/api/dashboardApiSlice";

export function Dashboard() {
  const { userInfo } = useSelector((state) => state.auth);

  const [usageLabels, setUsageLabels] = useState([]);
  const [usageData, setUsageData] = useState([]);

  const { refetch: Prefetch, data: Pdata } = useAsPerPriorityQuery();
  const { refetch: Srefetch, data: Sdata } = useAsPerStatusQuery();
  const { refetch: Lrefetch, data: Ldata } = useGetEachLengthQuery();
  const { refetch: Mrefetch, data: Mdata } = useGetMonthlyUsageQuery();

  useEffect(() => {
    Prefetch();
    Srefetch();
    Lrefetch();
    Mrefetch();
  }, [Prefetch, Srefetch, Lrefetch, Mrefetch]);

  useEffect(() => {
    if (Mdata && Mdata.NumberData && Mdata.labels) {
      setUsageData(Mdata.NumberData);
      setUsageLabels(Mdata.labels);
    }
  }, [Mdata]);

  if (
    !Pdata ||
    !Sdata ||
    !Ldata ||
    !Mdata?.NumberData ||
    !Mdata?.labels ||
    usageData.length === 0 ||
    usageLabels.length === 0
  ) {
    return <div>Loading....</div>;
  }
  return (
    <section className="DashboardMainSec">
      <div className="DashboardMainDiv">
        <div className="DashboardTopMainDiv">
          <p className="GreetingsAndNamePtag text">
            Greetings ,{userInfo.firstName} {userInfo.lastName}
          </p>
          <div className="AllLengthsFromBackendDiv text">
            <p className="EachLength1">Today: {Ldata.today}</p>
            <p className="EachLength2">Goals: {Ldata.goals}</p>
            <p className="EachLength3">Assigned tasks: {Ldata.assigned}</p>
            <p className="EachLength4">Upcomings: {Ldata.upcoming}</p>
            <p className="EachLength5">Teams: {Ldata.team}</p>
          </div>
        </div>
        <LineGraph labels={usageLabels || []} data={usageData || []} />
        <Charts statusData={Sdata} priorityData={Pdata} />
      </div>
    </section>
  );
}
