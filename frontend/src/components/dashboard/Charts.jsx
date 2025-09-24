// src/components/Charts.jsx
import React, { useEffect, useState } from "react";
import "./charts.css";
import { Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);


export function Charts({ statusData, priorityData }) {

  const [legendPosition,setLegendPosition]=useState()
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1042) {
        setLegendPosition("bottom"); // stack labels below the chart
      } else {
        setLegendPosition("right"); // default position
      }
    };

    handleResize(); // set on initial load
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);
  //Doughnut Chart for Status 
  const statusLabels = [
    "Completed",
    "In Progress",
    "Not Started",
    "Out of Time",
    "Paused",
  ];
  const statusColors = ["#0483bb", "#3EB489", "#FC8415", "#E53935", "#64748B"];
  const doughnutData = {
    labels: statusLabels,
    datasets: [
      {
        label: "Task Status",
        data: statusLabels.map((label) => statusData[label] || 0),
        backgroundColor: statusColors,
        borderWidth: 1,
        cutout: "70%",
      },
    ],
  };

  //Bar Chart for Priority
  const priorityLabels = [
    "Critical Priority",
    "High Priority",
    "Medium Priority",
    "Low Priority",
    "Very Low Priority",
  ];
  const barColors = ["#0483bb", "#0483bb", "#0483bb", "#0483bb", "#0483bb"];
  const barData = {
    labels: priorityLabels,
    datasets: [
      {
        label: "Task Priority",
        data: priorityLabels.map((label) => priorityData[label] || 0),
        backgroundColor: barColors,
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="ChartsMainSec">
      <div className="doughnutMainDiv">
        <p className="AtChartTitles title">Task Status Overview</p>
        <div className="doughnutOnlyDiv">
          <Doughnut
            data={doughnutData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: legendPosition, 
                  labels: {
                    usePointStyle: true,
                    padding: 20,
                  },
                },
              },
            }}
          />
        </div>
      </div>
      <div className="BarMainDiv">
        <p className="AtChartTitles title">Task Priority Distribution</p>
        <div className="BarOnlyDiv">
          <Bar
            data={barData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              animation: false, //no load animations
              hover: {
                mode: null, //disables hover mode
              },
              plugins: {
                tooltip: {
                  enabled: false, //disables tooltips
                },
                legend: {
                  display: false,
                },
              },
              scales: {
                x: { beginAtZero: true },
                y: { beginAtZero: true },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
