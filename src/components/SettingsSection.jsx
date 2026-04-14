import React, { useState } from "react";
import {
  Save,
  RefreshCcw,
  BellRing,
  HeartPulse,
  Thermometer,
  Activity,
  Droplets,
  ArrowLeft,
} from "lucide-react";

import { database } from "../firebase/firebase";
import { ref, update } from "firebase/database";



const SettingsSection = ({ currentThresholds , goHome }) => {

  const [values, setValues] = useState(currentThresholds);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {

    const thresholdRef = ref(database, "thresholds");

    update(thresholdRef, values)
      .then(() => {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      })
      .catch((err) => console.error("Update failed:", err));
  };

  

  return (

    <div className="max-w-3xl bg-[#0f172a] rounded-2xl p-10 border border-[#1e293b] shadow-xl">

   

      <div className="flex items-center gap-3 mb-10">

        <button onClick={goHome} className="p-2 rounded-lg hover:bg-[#020617] transition">
          <ArrowLeft size={20} className="text-slate-400 hover:text-slate-200 transition" />
        </button>

        <div>
          <h2 className="text-2xl font-bold text-slate-200">
            Alert Threshold Settings
          </h2>

          <p className="text-slate-400 text-sm">
            Adjust limits to control when alerts trigger.
          </p>
        </div>

      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* HEART RATE */}

        <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-xl">

          <div className="flex justify-between items-center mb-4">

            <div className="flex items-center gap-2 text-red-400 font-semibold">
              <HeartPulse size={20} /> HR Limits
            </div>

            <span className="text-red-400 font-bold text-lg">
              {values.hrMax} BPM
            </span>

          </div>

          <label className="text-[10px] font-black uppercase text-red-400">
            Max
          </label>

          <input
            type="range"
            min="60"
            max="200"
            value={values.hrMax}
            onChange={(e) =>
              setValues({ ...values, hrMax: parseInt(e.target.value) })
            }
            className="w-full accent-red-500 mb-4"
          />

          <label className="text-[10px] font-black uppercase text-red-400">
            Min
          </label>

          <input
            type="range"
            min="30"
            max="60"
            value={values.hrMin}
            onChange={(e) =>
              setValues({ ...values, hrMin: parseInt(e.target.value) })
            }
            className="w-full accent-red-400"
          />

        </div>

        {/* TEMPERATURE */}

        <div className="bg-pink-500/10 border border-pink-500/20 p-6 rounded-xl">

          <div className="flex justify-between items-center mb-4">

            <div className="flex items-center gap-2 text-pink-400 font-semibold">
              <Thermometer size={20} /> Temp Limits
            </div>

            <span className="text-pink-400 font-bold text-lg">
              {values.tempMax}°C
            </span>

          </div>

          <label className="text-[10px] font-black uppercase text-pink-400">
            Max
          </label>

          <input
            type="range"
            min="36"
            max="40"
            step="0.1"
            value={values.tempMax}
            onChange={(e) =>
              setValues({ ...values, tempMax: parseFloat(e.target.value) })
            }
            className="w-full accent-pink-500 mb-4"
          />

          <label className="text-[10px] font-black uppercase text-pink-400">
            Min
          </label>

          <input
            type="range"
            min="30"
            max="36"
            step="0.1"
            value={values.tempMin}
            onChange={(e) =>
              setValues({ ...values, tempMin: parseFloat(e.target.value) })
            }
            className="w-full accent-pink-400"
          />

        </div>

        {/* SPO2 */}

        <div className="bg-blue-500/10 border border-blue-500/20 p-6 rounded-xl">

          <div className="flex justify-between items-center mb-4">

            <div className="flex items-center gap-2 text-blue-400 font-semibold">
              <Activity size={20} /> SpO₂ Min
            </div>

            <span className="text-blue-400 font-bold text-lg">
              {values.spo2Min}%
            </span>

          </div>

          <input
            type="range"
            min="85"
            max="98"
            value={values.spo2Min}
            onChange={(e) =>
              setValues({ ...values, spo2Min: parseInt(e.target.value) })
            }
            className="w-full accent-blue-500"
          />

        </div>

        {/* GSR */}

        <div className="bg-yellow-500/10 border border-yellow-500/20 p-6 rounded-xl">

          <div className="flex justify-between items-center mb-4">

            <div className="flex items-center gap-2 text-yellow-400 font-semibold">
              <Droplets size={20} /> GSR Threshold
            </div>

            <span className="text-yellow-400 font-bold text-lg">
              {values.gsrMax}
            </span>

          </div>

          <label className="text-[10px] font-black uppercase text-yellow-400">
            High Stress
          </label>

          <input
            type="range"
            min="500"
            max="4000"
            value={values.gsrMax}
            onChange={(e) =>
              setValues({ ...values, gsrMax: parseInt(e.target.value) })
            }
            className="w-full accent-yellow-500 mb-4"
          />

        </div>

      </div>

      {/* BUTTONS */}

      <div className="mt-10 flex gap-4">

        <button
          onClick={handleSave}
          className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition"
        >
          <Save size={18} /> Save Changes
        </button>

        {/* <button
          onClick={() => setValues(currentThresholds)}
          className="px-6 py-3 border border-[#1e293b] rounded-xl text-slate-400 hover:bg-[#020617] transition flex items-center justify-center gap-2"
        >
          <RefreshCcw size={18} /> Reset
        </button> */}

        

      </div>

      {/* SUCCESS MESSAGE */}

      {saved && (
        <div className="mt-6 text-green-400 font-semibold text-center">
           Thresholds updated successfully
        </div>
      )}

    </div>
  );
};

export default SettingsSection;