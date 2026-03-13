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
  trendData = [], 
  color,
  unit,
  icon: Icon,
  chartType = "line",
}) => {
  
  const percentage = targetValue > 0 ? Math.min((currentValue / targetValue) * 100, 100) : 0;

  
  const chartData = {
    labels: trendData.map((_, idx) => idx + 1),
    datasets: [
      {
        data: trendData,
        borderColor: color,
        backgroundColor: chartType === "line" ? `${color}22` : color,
        tension: 0.4,
        fill: true,
        pointRadius: 0,
        borderRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
    scales: {
      x: { display: false },
      y: { display: false },
    },
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      {/* Header Area */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          {Icon && (
            <div 
              className="p-2.5 rounded-xl" 
              style={{ backgroundColor: `${color}15`, color: color }}
            >
              <Icon size={20} />
            </div>
          )}
          <h3 className="text-gray-500 font-semibold text-sm">{title}</h3>
        </div>
        <span className="text-gray-400 text-xs font-medium">
          Goal: {targetValue}{unit}
        </span>
      </div>

      {/* Main Value Display */}
      <div className="mb-4">
        <p className="text-2xl font-bold text-gray-800">
          {currentValue}
          <span className="text-sm font-normal text-gray-400 ml-1">{unit}</span>
        </p>
      </div>

      {/* Mini Sparkline Chart */}
      <div className="w-full h-16 mb-4">
        {trendData.length > 0 ? (
          chartType === "line" ? (
            <Line data={chartData} options={chartOptions} />
          ) : (
            <Bar data={chartData} options={chartOptions} />
          )
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-gray-50 rounded-lg">
            <span className="text-[10px] text-gray-300 uppercase font-bold tracking-widest">No Trend Data</span>
          </div>
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
            className="h-full rounded-full transition-all duration-1000"
            style={{ 
              width: `${percentage}%`, 
              backgroundColor: color,
              boxShadow: `0 0 10px ${color}44` 
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default DailyGoalCard;