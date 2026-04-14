import React from "react";
import { Line } from "react-chartjs-2";
import { Zap } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler);

const OxygenWave = ({ spo2, trendData = [] }) => {

  const waveData = {
    labels: trendData.map((_, i) => i),
    datasets: [
      {
        data: trendData,
        borderColor: "#3b82f6",
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 0,
        fill: true,
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 100);
          gradient.addColorStop(0, "rgba(59,130,246,0.45)");
          gradient.addColorStop(1, "rgba(59,130,246,0)");
          return gradient;
        },
      },
    ],
  };

  const waveOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 500 },
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
    scales: {
      x: { display: false },
      y: {
        display: false,
        min: 80,
        max: 100,
      },
    },
  };

  return (
    <div className="w-full bg-[#0f172a] rounded-2xl p-6 border border-[#1e293b] shadow-lg">

      {/* HEADER */}

      <div className="flex justify-between items-start mb-4">

        <div className="flex items-center gap-2">

          <div className="bg-blue-500 p-1.5 rounded-lg text-white shadow-lg shadow-blue-500/30">
            <Zap size={14} fill="white" />
          </div>

          <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">
            SpO₂ Saturation
          </span>

        </div>

        <div className="text-right">

          <span className="text-3xl font-black text-white">
            {spo2}%
          </span>

        </div>

      </div>

      {/* WAVEFORM */}

      <div className="h-20 w-full bg-[#020617] rounded-xl p-2">

        {trendData.length > 0 ? (

          <Line data={waveData} options={waveOptions} />

        ) : (

          <div className="h-full w-full flex items-center justify-center">

            <span className="text-[8px] font-bold text-blue-400 uppercase animate-pulse">
              Analyzing Blood Oxygen...
            </span>

          </div>

        )}

      </div>

      {/* STATUS BAR */}

      <div className="mt-4">

        <div className="flex justify-between text-[8px] font-black text-blue-400 uppercase mb-1">

          <span>
            Level: {spo2 > 94 ? "Normal" : "Low"}
          </span>

          <span>Target: 100%</span>

        </div>

        <div className="h-1.5 w-full bg-blue-900/40 rounded-full overflow-hidden">

          <div
            className="h-full bg-blue-500 transition-all duration-1000 shadow-[0_0_10px_rgba(59,130,246,0.8)]"
            style={{ width: `${spo2}%` }}
          />

        </div>

      </div>

    </div>
  );
};

export default OxygenWave;