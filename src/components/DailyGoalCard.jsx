// src/components/DailyGoalCard.jsx
import React from "react";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Filler,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement, 
  Tooltip, 
  Filler
);

const DailyGoalCard = ({ 
  title, 
  currentValue, 
  targetValue, 
  trendData, 
  color, 
  unit, 
  icon: Icon, // Pass a Lucide icon component
  chartType = "line" // Default to line chart
}) => {
  const percentage = Math.min((currentValue / targetValue) * 100, 100);

  const chartData = {
    labels: trendData.map((_, idx) => idx + 1),
    datasets: [
      {
        data: trendData,
        borderColor: color,
        backgroundColor: chartType === "line" ? `${color}22` : color, // Semi-transparent for line, solid for bar
        tension: 0.4,
        fill: true,
        pointRadius: 0,
        borderRadius: 4, // for bar charts
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { enabled: true } },
    scales: {
      x: { display: false },
      y: { display: false },
    },
  };

  return (
    <div className="bg-white shadow-sm border border-gray-100 rounded-2xl p-5 flex flex-col justify-between hover:shadow-md transition-all duration-300">
      {/* Header with Lucide Icon */}
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          {Icon && (
            <div className="p-2 rounded-lg" style={{ backgroundColor: `${color}15`, color: color }}>
              <Icon size={20} />
            </div>
          )}
          <h3 className="text-gray-500 font-semibold text-sm">{title}</h3>
        </div>
        <span className="text-gray-400 text-xs font-medium">
          Goal: {targetValue}{unit}
        </span>
      </div>

      {/* Main Value */}
      <div className="mb-4">
        <p className="text-2xl font-bold text-gray-800">
          {currentValue}
          <span className="text-sm font-normal text-gray-400 ml-1">{unit}</span>
        </p>
      </div>

      {/* Mini Sparkline Chart */}
      <div className="w-full h-16 mb-4">
        {chartType === "line" ? (
          <Line data={chartData} options={chartOptions} />
        ) : (
          <Bar data={chartData} options={chartOptions} />
        )}
      </div>

      {/* Progress Bar Area */}
      <div>
        <div className="flex justify-between items-end mb-1">
          <span className="text-xs font-bold" style={{ color: color }}>
            {percentage.toFixed(0)}%
          </span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2">
          <div
            className="h-2 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${percentage}%`, backgroundColor: color }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default DailyGoalCard;