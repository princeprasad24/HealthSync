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
import { Activity, MousePointer2 } from "lucide-react";

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
  const [activeDatasets, setActiveDatasets] = useState({
    steps: true,
    heartRate: true,
    spo2: true,
    gsr: true,
    temperature: true,
  });

  const stepsTrend = metricsData?.steps?.trend || [];
  const heartRateTrend = metricsData?.heartRate?.trend || [];
  const spo2Trend = metricsData?.spo2?.trend || [];
  const gsrTrend = metricsData?.gsr?.trend || [];
  const tempTrend = metricsData?.temperature?.trend || [];

  const maxLen = Math.max(
    stepsTrend.length,
    heartRateTrend.length,
    spo2Trend.length,
    gsrTrend.length,
    tempTrend.length,
    1
  );

  const labels = Array.from({ length: maxLen }, (_, idx) => `T-${maxLen - idx}`);

  const createGradient = (ctx, color) => {
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, `${color}44`);
    gradient.addColorStop(1, `${color}00`);
    return gradient;
  };

  const datasets = [
    {
      label: "Steps",
      data: stepsTrend,
      borderColor: "#10b981",
      backgroundColor: (ctx) => ctx.chart.ctx ? createGradient(ctx.chart.ctx, "#10b981") : "#10b98122",
      fill: true,
      hidden: !activeDatasets.steps,
      tension: 0.4,
      pointRadius: 2,
    },
    {
      label: "Heart Rate",
      data: heartRateTrend,
      borderColor: "#ef4444",
      backgroundColor: (ctx) => ctx.chart.ctx ? createGradient(ctx.chart.ctx, "#ef4444") : "#ef444422",
      fill: true,
      hidden: !activeDatasets.heartRate,
      tension: 0.4,
      pointRadius: 2,
    },
    {
      label: "SpO2",
      data: spo2Trend,
      borderColor: "#3b82f6",
      backgroundColor: (ctx) => ctx.chart.ctx ? createGradient(ctx.chart.ctx, "#3b82f6") : "#3b82f622",
      fill: true,
      hidden: !activeDatasets.spo2,
      tension: 0.4,
      pointRadius: 2,
    },
    {
      label: "Stress (GSR)",
      data: gsrTrend,
      borderColor: "#f59e0b",
      backgroundColor: (ctx) => ctx.chart.ctx ? createGradient(ctx.chart.ctx, "#f59e0b") : "#f59e0b22",
      fill: true,
      hidden: !activeDatasets.gsr,
      tension: 0.4,
      pointRadius: 2,
    },
    {
      label: "Temperature",
      data: tempTrend,
      borderColor: "#ec4899",
      backgroundColor: (ctx) => ctx.chart.ctx ? createGradient(ctx.chart.ctx, "#ec4899") : "#ec489922",
      fill: true,
      hidden: !activeDatasets.temperature,
      tension: 0.4,
      pointRadius: 2,
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
        backgroundColor: "#0f172a",
        titleColor: "#f8fafc",
        bodyColor: "#cbd5e1",
        borderColor: "#334155",
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        titleFont: { weight: "bold", size: 14 },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: { color: "#334155", drawBorder: false },
        ticks: { color: "#cbd5e1", font: { weight: "bold" } },
      },
      x: {
        grid: { display: false },
        ticks: { color: "#cbd5e1", font: { weight: "bold" } },
      },
    },
  };

  const toggleDataset = (key) => setActiveDatasets((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="bg-[#0f172a] p-8 rounded-2xl shadow-lg border border-[#1e293b]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Vitals Analytics</h2>
         
        </div>

       
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-8">
        {Object.keys(activeDatasets).map((key) => {
          const dataset = datasets.find((d) => d.label.toLowerCase().includes(key.toLowerCase()));
          return (
            <button
              key={key}
              onClick={() => toggleDataset(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-[10px] font-black uppercase tracking-tighter transition-all ${
                activeDatasets[key]
                  ? "bg-[#334155] text-white border-[#334155] shadow-md"
                  : "bg-[#0f172a] text-slate-400 border-[#334155] hover:border-slate-500"
              }`}
            >
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: dataset?.borderColor }} />
              {key}
            </button>
          );
        })}
      </div>

      <div className="h-80">
        {maxLen > 0 ? (
          <Line data={{ labels, datasets }} options={chartOptions} />
        ) : (
          <div className="h-full flex flex-col items-center justify-center bg-[#1e293b] rounded-2xl border border-dashed border-slate-700">
            <Activity className="text-slate-600 h-10 w-10 mb-2 animate-pulse" />
            <p className="text-slate-400 text-xs font-bold uppercase">Awaiting sensor data...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrendChart;