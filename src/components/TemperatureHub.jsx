import React from "react";
import { Line } from "react-chartjs-2";
import { Thermometer, Flame } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler);

const TemperatureHub = ({ temp, trendData = [], thresholds }) => {

  const isFever = temp >= thresholds.tempMax;
  const isHypo = temp <= thresholds.tempMin;

  const statusColor = isFever
    ? "#ec4899"
    : isHypo
    ? "#3b82f6"
    : "#10b981";

  const waveData = {
    labels: trendData.map((_, i) => i),

    datasets: [
      {
        data: trendData,
        borderColor: statusColor,
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 0,
        fill: true,

        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 100);

          gradient.addColorStop(0, `${statusColor}55`);
          gradient.addColorStop(1, `${statusColor}00`);

          return gradient;
        },
      },
    ],
  };

  const waveOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 800 },

    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },

    scales: {
      x: { display: false },
      y: { display: false, min: 30, max: 42 },
    },
  };

  return (
    <div className="w-full bg-[#0f172a] rounded-2xl p-6 border border-[#1e293b] shadow-lg flex flex-col justify-between">

      {/* HEADER */}

      <div className="flex justify-between items-start mb-6">

        <div className="flex items-center gap-3">

          <div
            className="p-2.5 rounded-xl"
            style={{
              backgroundColor: `${statusColor}22`,
              color: statusColor,
            }}
          >
            <Thermometer size={20} />
          </div>

          <div>

            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
              Body Thermal
            </h3>

            <p className="text-[10px] font-bold text-slate-300 mt-1 uppercase">
              {isFever
                ? "Fever Detected"
                : isHypo
                ? "Hypothermic"
                : "Stable"}
            </p>

          </div>

        </div>

        <div className="text-right">

          <div className="flex items-baseline gap-1">

            <span className="text-4xl font-black text-white">
              {temp}
            </span>

            <span className="text-sm font-bold text-slate-400">
              °C
            </span>

          </div>

        </div>

      </div>

      {/* GAUGE + CHART */}

      <div className="flex gap-4 items-end h-24">

        {/* THERMAL GAUGE */}

        <div className="w-3 h-full bg-[#020617] rounded-full relative overflow-hidden">

          <div
            className="absolute bottom-0 w-full transition-all duration-1000 shadow-[0_0_12px_rgba(0,0,0,0.5)]"
            style={{
              height: `${((temp - 30) / (42 - 30)) * 100}%`,
              backgroundColor: statusColor,
            }}
          >

            {isFever && (
              <Flame
                size={8}
                className="text-white absolute top-1 left-1/2 -translate-x-1/2 animate-bounce"
              />
            )}

          </div>

        </div>

        {/* TREND CHART */}

        <div className="flex-1 h-full bg-[#020617] rounded-lg p-2">

          <Line data={waveData} options={waveOptions} />

        </div>

      </div>

    </div>
  );
};

export default TemperatureHub;