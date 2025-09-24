import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

import './dailyReport.css'

export function DailyReport({report}) {

  const completed = report.completedObjectives || 0;
  const total = report.totalObjectives || 0;
  const incomplete = Math.max(total - completed, 0);

  const data = {
    labels: ["Completed", "Incomplete"],
    datasets: [
      {
        data: [completed, incomplete],
        backgroundColor: ["#0483bb", "#fc8415"],
        borderColor: ["#0988bfff", "#d16908ff"],
        borderWidth: 2,
        cutout: "70%",
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#444",
          font: { size: 14, weight: "bold" },
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: "#333",
        titleColor: "#fff",
        bodyColor: "#eee",
        padding: 12,
        borderColor: "#888",
        borderWidth: 1,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="DailyReportMainSec">
      <p className="DailyReportMainTitle title">Yesterday's Report</p>
      <div className="DailyDoghnutWrapper">
        <Doughnut data={data} options={options} />
      </div>

        <p className="DailyDoughnutText text">{completed} of {total} objectives completed</p>
    </div>
  );
}
