import React, { useState } from "react";
import { Save, RefreshCcw, BellRing, HeartPulse, Thermometer, Activity, Droplets } from "lucide-react";
import { database } from "../firebase/firebase";
import { ref, update } from "firebase/database";

const SettingsSection = ({ currentThresholds }) => {
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
    <div className="max-w-3xl bg-white rounded-3xl p-10 border border-gray-100 shadow-md">

      {/* Header */}
      <div className="flex items-center gap-3 mb-10">
        <div className="bg-blue-100 text-blue-600 p-3 rounded-xl">
          <BellRing size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Alert Threshold Settings</h2>
          <p className="text-gray-400 text-sm">Adjust limits to control when alerts trigger.</p>
        </div>
      </div>

      {/* Threshold Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* HEART RATE */}
        <div className="bg-red-50 border border-red-100 p-6 rounded-2xl">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2 text-red-600 font-semibold">
              <HeartPulse size={20}/> HR Limits
            </div>
            <span className="text-red-600 font-bold text-lg">{values.hrMax} BPM</span>
          </div>
          <label className="text-[10px] font-black uppercase text-red-400">Max</label>
          <input
            type="range"
            min="60"
            max="200"
            value={values.hrMax}
            onChange={(e) => setValues({...values, hrMax: parseInt(e.target.value)})}
            className="w-full accent-red-500 mb-4"
          />
          <label className="text-[10px] font-black uppercase text-red-400">Min</label>
          <input
            type="range"
            min="30"
            max="60"
            value={values.hrMin}
            onChange={(e) => setValues({...values, hrMin: parseInt(e.target.value)})}
            className="w-full accent-red-400"
          />
        </div>

        {/* TEMPERATURE */}
        <div className="bg-pink-50 border border-pink-100 p-6 rounded-2xl">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2 text-pink-600 font-semibold">
              <Thermometer size={20}/> Temp Limits
            </div>
            <span className="text-pink-600 font-bold text-lg">{values.tempMax}°C</span>
          </div>
          <label className="text-[10px] font-black uppercase text-pink-400">Max</label>
          <input
            type="range"
            min="36"
            max="40"
            step="0.1"
            value={values.tempMax}
            onChange={(e) => setValues({...values, tempMax: parseFloat(e.target.value)})}
            className="w-full accent-pink-500 mb-4"
          />
          <label className="text-[10px] font-black uppercase text-pink-400">Min</label>
          <input
            type="range"
            min="30"
            max="36"
            step="0.1"
            value={values.tempMin}
            onChange={(e) => setValues({...values, tempMin: parseFloat(e.target.value)})}
            className="w-full accent-pink-400"
          />
        </div>

        {/* SPO2 */}
        <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2 text-blue-600 font-semibold">
              <Activity size={20}/> SpO₂ Min
            </div>
            <span className="text-blue-600 font-bold text-lg">{values.spo2Min}%</span>
          </div>
          <input
            type="range"
            min="85"
            max="98"
            value={values.spo2Min}
            onChange={(e) => setValues({...values, spo2Min: parseInt(e.target.value)})}
            className="w-full accent-blue-500"
          />
        </div>

        {/* GSR */}
        <div className="bg-yellow-50 border border-yellow-100 p-6 rounded-2xl">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2 text-yellow-600 font-semibold">
              <Droplets size={20}/> GSR Threshold
            </div>
            <span className="text-yellow-600 font-bold text-lg">{values.gsrMax}</span>
          </div>
          <label className="text-[10px] font-black uppercase text-yellow-400">High Stress</label>
          <input
            type="range"
            min="500"
            max="2000"
            value={values.gsrMax}
            onChange={(e) => setValues({...values, gsrMax: parseInt(e.target.value)})}
            className="w-full accent-yellow-500 mb-4"
          />
        </div>

      </div>

      {/* Buttons */}
      <div className="mt-10 flex gap-4">
        <button
          onClick={handleSave}
          className="flex-1 bg-gray-900 hover:bg-black text-white font-semibold py-3 rounded-2xl flex items-center justify-center gap-2 transition"
        >
          <Save size={18}/> Save Changes
        </button>
        <button
          onClick={() => setValues(currentThresholds)}
          className="px-6 py-3 border border-gray-200 rounded-2xl text-gray-500 hover:bg-gray-50 transition flex items-center justify-center"
        >
          <RefreshCcw size={18}/> Reset
        </button>
      </div>

      {/* Save Success Message */}
      {saved && (
        <div className="mt-6 text-green-600 font-semibold text-center">
          ✅ Thresholds updated successfully
        </div>
      )}
    </div>
  );
};

export default SettingsSection;