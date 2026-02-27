// src/components/TrendChart.jsx
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
  Filler
);

const TrendChart = ({ metricsData = {} }) => {
  const [timeframe, setTimeframe] = useState("Daily");
  const [activeDatasets, setActiveDatasets] = useState({
    steps: true,
    heartRate: true,
    spo2: true,
    gsr: true,
    temp: true,
  });

  // Ensure all metrics are arrays
  const steps = Array.isArray(metricsData.steps) ? metricsData.steps : [];
  const heartRate = Array.isArray(metricsData.heartRate) ? metricsData.heartRate : [];
  const spo2 = Array.isArray(metricsData.spo2) ? metricsData.spo2 : [];
  const gsr = Array.isArray(metricsData.gsr) ? metricsData.gsr : [];

  const labels = steps.map((_, idx) => {
    if (timeframe === "Daily") return `Hr ${idx + 1}`;
    if (timeframe === "Weekly") return `Day ${idx + 1}`;
    return `Week ${idx + 1}`;
  });

  const datasets = [
    {
      label: "Steps",
      data: steps,
      borderColor: "#10b981",
      backgroundColor: "rgba(16, 185, 129, 0.1)",
      hidden: !activeDatasets.steps,
    },
    {
      label: "Heart Rate",
      data: heartRate,
      borderColor: "#ef4444",
      backgroundColor: "rgba(239, 68, 68, 0.1)",
      hidden: !activeDatasets.heartRate,
    },
    {
      label: "SpO₂",
      data: spo2,
      borderColor: "#3b82f6",
      backgroundColor: "rgba(59, 130, 246, 0.1)",
      hidden: !activeDatasets.spo2,
    },
    {
      label: "Stress (GSR)",
      data: gsr,
      borderColor: "#f59e0b",
      backgroundColor: "rgba(245, 158, 11, 0.1)",
      hidden: !activeDatasets.gsr,
    },
  ].map(ds => ({
    ...ds,
    tension: 0.4,
    fill: true,
    pointRadius: 4,
    pointHoverRadius: 6,
  }));

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
        beginAtZero: true,
        grid: { color: "#f3f4f6" },
      },
      x: { grid: { display: false } },
    },
  };

  const toggleDataset = (key) => {
    setActiveDatasets(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="bg-white shadow-sm border border-gray-100 rounded-2xl p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Health Trends</h2>
          <p className="text-sm text-gray-400">Visualize your physiological patterns</p>
        </div>

        <div className="flex items-center gap-3 bg-gray-50 p-1.5 rounded-xl border border-gray-100">
          <Calendar size={18} className="text-gray-400 ml-2" />
          <div className="flex gap-1">
            {["Daily", "Weekly", "Monthly"].map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition-all ${
                  timeframe === t
                    ? "bg-white shadow-sm text-green-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex items-center gap-2 mr-2 text-gray-400">
          <Filter size={16} />
          <span className="text-xs font-bold uppercase tracking-wider">Metrics:</span>
        </div>
        {Object.keys(activeDatasets)
          .filter(k => k !== 'temp')
          .map((key) => (
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
                style={{
                  backgroundColor: datasets.find(d => d.label.toLowerCase().includes(key))?.borderColor,
                }}
              />
              {key.toUpperCase()}
            </button>
          ))}
      </div>

      <div className="h-80">
        {labels.length > 0 ? (
          <Line data={{ labels, datasets }} options={chartOptions} />
        ) : (
          <p className="text-center text-gray-400 mt-16">No data available</p>
        )}
      </div>
    </div>
  );
};

export default TrendChart;
