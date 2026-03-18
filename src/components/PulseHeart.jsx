import React from "react";
import { Heart } from "lucide-react";
import { Line } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const PulseHeart = ({ bpm = 0, trendData = [] }) => {

  const pulseDuration = bpm > 0 ? `${60 / bpm}s` : "1s";

  const displayData =
    trendData && trendData.length > 5
      ? trendData
      : [72, 75, 70, 78, 74, 76, 73, 77];

  const waveData = {
    labels: displayData.map((_, i) => i),

    datasets: [
      {
        data: displayData,
        borderColor: "#ef4444",
        borderWidth: 3,
        tension: 0.45,
        pointRadius: 0,
        fill: true,

        backgroundColor: (context) => {
          const chart = context.chart;

          if (!chart?.ctx) return "rgba(239,68,68,0.2)";

          const gradient = chart.ctx.createLinearGradient(0, 0, 0, 120);

          gradient.addColorStop(0, "rgba(239,68,68,0.45)");
          gradient.addColorStop(1, "rgba(239,68,68,0)");

          return gradient;
        },
      },
    ],
  };

  const waveOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,

    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },

    scales: {
      x: { display: false },
      y: {
        display: false,
        min: 40,
        max: 180,
      },
    },
  };

  return (

    <div className="w-full flex flex-col items-center">

      {/* HEART ICON */}

      <div className="relative flex items-center justify-center mb-8">

        <div
          className="absolute h-36 w-36 bg-red-500/10 rounded-full blur-3xl"
          style={{
            animation:
              bpm > 0
                ? `ping ${pulseDuration} infinite cubic-bezier(0,0,0.2,1)`
                : "none",
          }}
        />

        <div
          style={{
            animation:
              bpm > 0
                ? `heartbeat ${pulseDuration} infinite ease-in-out`
                : "none",
          }}
        >
          <Heart
            size={72}
            fill="#ef4444"
            stroke="none"
            className="drop-shadow-[0_0_20px_rgba(239,68,68,0.7)]"
          />
        </div>

      </div>

      {/* ECG WAVE */}

      <div className="w-full h-28 mt-4 bg-[#020617] rounded-2xl overflow-hidden border border-[#1e293b] p-2 shadow-inner">

        <div className="flex justify-between items-center mb-1 px-3">

          <span className="text-[9px] font-black text-red-500 uppercase tracking-[0.2em] animate-pulse">
            Live Stream
          </span>

          <div className="flex items-center gap-1">
            <div className="h-1.5 w-1.5 bg-red-500 rounded-full animate-ping" />
            <div className="h-1.5 w-1.5 bg-red-500 rounded-full" />
          </div>

        </div>

        <div className="h-16 px-2">
          <Line data={waveData} options={waveOptions} />
        </div>

      </div>

      {/* HEARTBEAT KEYFRAME */}

      <style>
        {`
        @keyframes heartbeat {

          0% { transform: scale(1); }

          10% { transform: scale(1.25); }

          20% { transform: scale(1); }

          30% { transform: scale(1.15); }

          100% { transform: scale(1); }

        }
        `}
      </style>

    </div>

  );
};

export default PulseHeart;