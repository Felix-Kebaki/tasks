import {
    Chart as ChartJS,
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    Tooltip,
    Legend
  } from "chart.js";
  import { Line } from "react-chartjs-2";
  import { useRef, useEffect } from "react";

  import './lineGraph.css'
  
  ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);
  
  export function LineGraph ({ labels, data }) {
    const chartRef = useRef(null);
  
    // Setup chart data
    const chartData = {
      labels,
      datasets: [
        {
          label: "",
          data,
          fill: true,
          backgroundColor: "rgba(59, 130, 246, 0.2)",
          borderColor: "#0483bb",
          tension: 0.4,
        },
      ],
    };
  
    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      plugins: {
        legend: {display:false},
      },
      scales: {
        y: { beginAtZero: true },
      },
    };
  
    // Destroy previous chart instance on unmount or data change
    useEffect(() => {
      const chartInstance = chartRef.current;
  
      return () => {
        if (chartInstance && chartInstance.destroy) {
          chartInstance.destroy();
        }
      };
    }, [data, labels]);
  
    return (
      <section className="LineGraphMainSec">
        <p className="AtChartTitles title">Monthly Platform Activity</p>
        <div className="LineGraphOnly">
        <Line ref={chartRef} data={chartData} options={chartOptions} />
        </div>
      </section>
    );
  };
  
  export default LineGraph;
  
