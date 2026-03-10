import React, { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { Calendar, Filter } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

const TrendChart = ({ metricsData = {} }) => {
  const [timeframe, setTimeframe] = useState("Daily");
  const [activeDatasets, setActiveDatasets] = useState({
    steps: true,
    heartRate: true,
    spo2: true,
    gsr: true,
    temperature: true,
  });

  // Safely extract trend arrays from the nested structure
  const stepsTrend = metricsData?.steps?.trend || [];
  const heartRateTrend = metricsData?.heartRate?.trend || [];
  const spo2Trend = metricsData?.spo2?.trend || [];
  const gsrTrend = metricsData?.gsr?.trend || [];
  const tempTrend = metricsData?.temperature?.trend || [];

  // Create labels based on the longest available trend array
  const maxLen = Math.max(
    stepsTrend.length, 
    heartRateTrend.length, 
    spo2Trend.length, 
    gsrTrend.length, 
    tempTrend.length,
    1 // Fallback to at least 1 label
  );

  const labels = Array.from({ length: maxLen }, (_, idx) => {
    if (timeframe === "Daily") return `Hr ${idx + 1}`;
    if (timeframe === "Weekly") return `Day ${idx + 1}`;
    return `Week ${idx + 1}`;
  });

  const datasets = [
    {
      label: "Steps",
      data: stepsTrend,
      borderColor: "#10b981",
      backgroundColor: "rgba(16, 185, 129, 0.1)",
      fill: true,
      hidden: !activeDatasets.steps,
    },
    {
      label: "Heart Rate",
      data: heartRateTrend,
      borderColor: "#ef4444",
      backgroundColor: "rgba(239, 68, 68, 0.1)",
      fill: true,
      hidden: !activeDatasets.heartRate,
    },
    {
      label: "SpO2",
      data: spo2Trend,
      borderColor: "#3b82f6",
      backgroundColor: "rgba(59, 130, 246, 0.1)",
      fill: true,
      hidden: !activeDatasets.spo2,
    },
    {
      label: "GSR (Stress)",
      data: gsrTrend,
      borderColor: "#f59e0b",
      backgroundColor: "rgba(245, 158, 11, 0.1)",
      fill: true,
      hidden: !activeDatasets.gsr,
    },
    {
      label: "Temperature",
      data: tempTrend,
      borderColor: "#ec4899",
      backgroundColor: "rgba(236, 72, 153, 0.1)",
      fill: true,
      hidden: !activeDatasets.temperature,
    },
  ];

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        mode: "index",
        intersect: false,
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        titleColor: "#1f2937",
        bodyColor: "#4b5563",
        borderColor: "#e5e7eb",
        borderWidth: 1,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: { color: "#f3f4f6" },
      },
      x: {
        grid: { display: false },
      },
    },
  };

  const toggleDataset = (key) => {
    setActiveDatasets((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Health Trends</h2>
          <p className="text-sm text-gray-500">Visualizing your vitals over time</p>
        </div>
        
        {/* <div className="flex bg-gray-100 p-1 rounded-xl">
          {["Daily", "Weekly", "Monthly"].map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                timeframe === t ? "bg-white text-gray-800 shadow-sm" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {t}
            </button>
          ))}
        </div> */}
      </div>

      {/* Dataset Filter Toggles */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex items-center gap-2 mr-2 text-gray-400">
          <Filter size={16} />
          <span className="text-xs font-bold uppercase tracking-wider">Show:</span>
        </div>
        {Object.keys(activeDatasets).map((key) => (
          <button
            key={key}
            onClick={() => toggleDataset(key)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all ${
              activeDatasets[key]
                ? "bg-gray-800 text-white border-gray-800"
                : "bg-white text-gray-400 border-gray-200"
            }`}
          >
            <div 
              className="w-2 h-2 rounded-full" 
              style={{ backgroundColor: datasets.find(d => d.label.toLowerCase().includes(key.toLowerCase()))?.borderColor }} 
            />
            {key.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="h-80">
        {maxLen > 0 ? (
          <Line data={{ labels, datasets }} options={chartOptions} />
        ) : (
          <div className="h-full flex items-center justify-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <p className="text-gray-400 text-sm">No trend data available from sensors yet...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrendChart;