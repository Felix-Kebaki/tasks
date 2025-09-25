import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);
import moment from 'moment'
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
        borderColor: ["#02709fff", "#d16908ff"],
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
          color: "black",
          font: { size: 11, weight: "normal" },
          padding: 20,
          boxWidth: 10,  
            boxHeight: 7, 
        },
      },
      tooltip: {
        backgroundColor: "#333",
        titleColor: "white",
        bodyColor: "white",
        padding: 4,
        borderColor: "#333",
        borderWidth: 1,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="DailyReportMainSec">
        <div>
      <p className="DailyReportMainTitle title">Review</p>
      <p className="ReviewsDate text">{moment(report.date).format("MMMM Do YYYY")}</p>
      </div>
      <div className="DailyDoghnutWrapper">
        <Doughnut data={data} options={options} />
      </div>

        <p className="DailyDoughnutText text">{completed} of {total} objectives completed</p>
        <div className={report?.performance===("Excellent" || "Good" || "Fair")?"ReviewsPercentageMainDiv ReviewsPercentageBlueMainDiv":"ReviewsPercentageMainDiv ReviewsPercentageOrgMainDiv"}>
            <p className="PerformancePercentage title">{(completed*100)/total}%</p>
            <p className={report?.performance===("Excellent" || "Good" || "Fair")?"BlueColorPerfomance text":"OrangeColorPerformance text"}>{report?.performance}</p>
        </div>
    </div>
  );
}
