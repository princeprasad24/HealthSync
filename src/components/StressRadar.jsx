import React from "react";
import { Line } from "react-chartjs-2";
import { Droplets, Activity } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler);

const StressRadar = ({ gsr, trendData = [], threshold }) => {

  const getStressColor = (val) => {
    if (val >= 1500) return "#f59e0b"; // High Stress
    if (val >= 500) return "#fbbf24";  // Medium Stress
    return "#10b981";                  // Relaxed
  };

  const currentColor = getStressColor(gsr);

  const waveData = {
    labels: trendData.map((_, i) => i),
    datasets: [
      {
        data: trendData,
        borderColor: currentColor,
        borderWidth: 2,
        tension: 0.35,
        pointRadius: 0,
        fill: true,
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 150);
          gradient.addColorStop(0, `${currentColor}66`);
          gradient.addColorStop(1, `${currentColor}00`);
          return gradient;
        },
      },
    ],
  };

  const waveOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 200 },
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
    scales: {
      x: { display: false },
      y: { display: false, min: 0, max: 4095 },
    },
  };

  return (
    <div className="w-full bg-[#0f172a] rounded-2xl p-6 border border-[#1e293b] shadow-lg">

      {/* HEADER */}

      <div className="flex justify-between items-center mb-6">

        <div className="flex items-center gap-3">

          <div
            className="p-2 rounded-xl"
            style={{
              backgroundColor: `${currentColor}22`,
              color: currentColor,
            }}
          >
            <Droplets size={20} />
          </div>

          <div>

            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
              Stress Flux
            </h3>

            <p className="text-xs font-bold text-slate-300 mt-1">
              {gsr < 500 ? "Relaxed" : gsr < 1500 ? "Active" : "High Stress"}
            </p>

          </div>

        </div>

        <div className="text-right">

          <span className="text-3xl font-black text-white">
            {gsr}
          </span>

          <p className="text-[8px] font-bold text-slate-500 uppercase">
            Raw GSR
          </p>

        </div>

      </div>

      {/* CHART AREA */}

      <div className="h-24 w-full bg-[#020617] rounded-xl p-2 relative overflow-hidden">

        {/* Radar Scan Effect */}

        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-600/10 to-transparent w-1/2 animate-scan"></div>

        {trendData.length > 0 ? (
          <Line data={waveData} options={waveOptions} />
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <Activity className="text-slate-600 animate-pulse" size={24} />
          </div>
        )}

      </div>

      <style>{`
        @keyframes scan {
          from { transform: translateX(-100%); }
          to { transform: translateX(200%); }
        }
        .animate-scan { animation: scan 3s linear infinite; }
      `}</style>

    </div>
  );
};

export default StressRadar;