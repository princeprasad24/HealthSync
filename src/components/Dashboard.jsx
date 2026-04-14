import React, { useState, useEffect, useRef } from "react";
import Sidebar from "./sideBar";
import TrendChart from "./TrendChart";
import AlertSection from "./AlertSection";
import SettingsSection from "./SettingsSection";
import TemperatureHub from "./TemperatureHub";
import PulseHeart from "./PulseHeart";
import OxygenWave from "./OxygenWave";
import StressRadar from "./StressRadar";

import { database } from "../firebase/firebase";
import { ref, onValue, push, serverTimestamp } from "firebase/database";

import { Flame, Clock } from "lucide-react";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("Home");
  const [isNotificationEnabled, setNotificationEnabled] = useState(true);
  const [lastUpdate, setLastUpdate] = useState("");

  const alertsStates = useRef({});

  const [thresholds, setThresholds] = useState({
    hrMax: 120,
    hrMin: 50,
    tempMax: 38,
    tempMin: 35,
    spo2Min: 94,
    gsrMax: 2000,
  });

  const [metrics, setMetrics] = useState({
    heartRate: { current: 0, target: 100, trend: [] },
    spo2: { current: 0, target: 100, trend: [] },
    steps: { current: 0, target: 10000, trend: [] },
    gsr: { current: 0, target: 4095, trend: [] },
    temperature: { current: 0, target: 37.5, trend: [] },
    isFallen: false,
  });

  const updateTrend = (trendArray, newValue) => {
    const newTrend = [...trendArray, newValue];
    return newTrend.slice(-20);
  };

  console.log(updateTrend)

  useEffect(() => {
    const thresholdRef = ref(database, "thresholds");

    const unsubscribe = onValue(thresholdRef, (snapshot) => {
      if (snapshot.exists()) {
        setThresholds((prev) => ({
          ...prev,
          ...snapshot.val(),
        }));
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const rootRef = ref(database, "/");

    const unsubscribe = onValue(rootRef, (snapshot) => {
      if (!snapshot.exists()) return;

      const data = snapshot.val();
      const health = data.healthData || {};
      const sensors = data.sensorData || {};

      setMetrics((prev) => {
        const validTemp =
          sensors.temperature !== undefined && sensors.temperature !== -127
            ? sensors.temperature
            : prev.temperature.current;

        return {
          ...prev,

          heartRate: {
            ...prev.heartRate,
            current:
              health.heartRate !== undefined
                ? health.heartRate
                : prev.heartRate.current,
            trend:
              health.heartRate !== undefined
                ? updateTrend(prev.heartRate.trend, health.heartRate)
                : prev.heartRate.trend,
          },

          spo2: {
            ...prev.spo2,
            current:
              health.spo2 !== undefined ? health.spo2 : prev.spo2.current,
            trend:
              health.spo2 !== undefined
                ? updateTrend(prev.spo2.trend, health.spo2)
                : prev.spo2.trend,
          },

          steps: {
            ...prev.steps,
            current:
              sensors.steps !== undefined ? sensors.steps : prev.steps.current,
            trend:
              sensors.steps !== undefined
                ? updateTrend(prev.steps.trend, sensors.steps)
                : prev.steps.trend,
          },

          gsr: {
            ...prev.gsr,
            current: sensors.gsr !== undefined ? sensors.gsr : prev.gsr.current,
            trend:
              sensors.gsr !== undefined
                ? updateTrend(prev.gsr.trend, sensors.gsr)
                : prev.gsr.trend,
          },

          temperature: {
            ...prev.temperature,
            current: validTemp,
            trend:
              validTemp !== prev.temperature.current
                ? updateTrend(prev.temperature.trend, validTemp)
                : prev.temperature.trend,
          },

          isFallen:
            health.isFallen !== undefined
              ? health.isFallen
              : sensors.isFallen || false,
        };
      });

      setLastUpdate(new Date().toLocaleTimeString());
    });

    return () => unsubscribe();
  }, []);

  const calories = (metrics.steps.current * 0.04).toFixed(1);

  const stepProgress = Math.min(
    (metrics.steps.current / metrics.steps.target) * 100,
    100,
  );

  useEffect(() => {
    const { heartRate, spo2, temperature, gsr, isFallen } = metrics;
    const alertsRef = ref(database, "alerts");

    const triggerAlert = (type, message, severity) => {
      if (alertsStates.current[type]) return;

      const newAlert = {
        type,
        message,
        severity,
        timestamp: serverTimestamp(),
        isRead: false,
      };

      push(alertsRef, newAlert);
      alertsStates.current[type] = true;
    };

    const resetAlert = (type) => {
      alertsStates.current[type] = false;
    };

    if (heartRate.current > 0) {
      if (heartRate.current > thresholds.hrMax) {
        triggerAlert(
          "Heart Rate",
          `High Pulse: ${heartRate.current} BPM (Limit: ${thresholds.hrMax})`,
          "high",
        );
      } else if (heartRate.current < thresholds.hrMin) {
        triggerAlert(
          "Heart Rate",
          `Low Pulse: ${heartRate.current} BPM (Limit: ${thresholds.hrMin})`,
          "high",
        );
      } else {
        resetAlert("Heart Rate");
      }

      if (spo2.current > 0 && spo2.current < thresholds.spo2Min) {
        triggerAlert(
          "Oxygen",
          `Low SpO2: ${spo2.current}% (Min: ${thresholds.spo2Min}%)`,
          "high",
        );
      } else if (spo2.current >= thresholds.spo2Min) {
        resetAlert("Oxygen");
      }

      if (temperature.current > 0) {
    if (temperature.current > thresholds.tempMax) {
      triggerAlert("Temperature", `Fever: ${temperature.current}°C (Max: ${thresholds.tempMax}°C)`, "high");
    } else if (temperature.current < thresholds.tempMin) {
      triggerAlert("Temperature", `Hypothermia: ${temperature.current}°C (Min: ${thresholds.tempMin}°C)`, "high");
    } else {
      resetAlert("Temperature");
    }
  }

      if (gsr.current >= thresholds.gsrMax) {
        triggerAlert(
          "Stress",
          `High GSR: ${gsr.current} (Limit: ${thresholds.gsrMax})`,
          "medium",
        );
      } else if (gsr.current < thresholds.gsrMax) {
        resetAlert("Stress");
      }

      if (isFallen) {
        triggerAlert(
          "Emergency",
          "Fall detection protocol triggered!",
          "high",
        );
      } else {
        resetAlert("Emergency");
      }
    }
  });

  useEffect(() => {
    const alertsRef = ref(database, "alerts");

    const unsubscribe = onValue(alertsRef, (snapshot) => {
      if (!snapshot.exists() || !isNotificationEnabled) return;

      const allAlerts = snapshot.val();
      const alertKeys = Object.keys(allAlerts);
      const latestKey = alertKeys[alertKeys.length - 1];
      const latestAlert = allAlerts[latestKey];

      if (!latestAlert.isRead && latestAlert.timestamp > Date.now() - 5000) {
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification(`Health Alert: ${latestAlert.type}`, {
            body: latestAlert.message,
            icon: "/alert-icon.png",
          });
        }
      }
    });

    return () => unsubscribe();
  }, [isNotificationEnabled]);

  return (
    <div className="min-h-screen bg-[#020617] flex font-sans text-slate-200">
      {/* <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} /> */}

      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {/* HEADER */}

        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-white">
              Health Overview
            </h1>

            <div className="flex items-center gap-2 mt-2">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>

              <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                Live IoT Sync Active
              </p>
            </div>
          </div>

          <div className="bg-[#0f172a] px-5 py-3 rounded-xl shadow border border-[#1e293b] flex items-center gap-3">
            <Clock size={16} className="text-slate-400" />

            <span className="text-xs font-semibold text-slate-300">
              Sync: {lastUpdate}
            </span>
          </div>
        </header>

        {activeTab === "Home" && (
          <div className="grid grid-cols-12 gap-6">
            {/* STEP CARD */}

            <div className="col-span-12 xl:col-span-8 bg-[#0f172a] rounded-2xl p-8 shadow border border-[#1e293b]">
              <div className="flex justify-between">
                <div>
                  <p className="text-slate-400 text-xs font-bold uppercase">
                    Activity Progress
                  </p>

                  <div className="flex items-end gap-2">
                    <span className="text-6xl font-black text-white">
                      {metrics.steps.current}
                    </span>

                    <span className="text-slate-400 font-semibold text-lg">
                      Steps
                    </span>
                  </div>
                </div>

                <div className="bg-[#1e293b] text-green-400 px-4 py-2 rounded-lg flex items-center gap-2 font-bold text-sm">
                  <Flame size={18} />

                  {calories}

                  <span className="text-xs opacity-70">kcal</span>
                </div>
              </div>

              <div className="mt-8">
                <div className="flex justify-between text-xs text-slate-400 mb-2">
                  <span>{stepProgress.toFixed(0)}%</span>
                  <span>{metrics.steps.target}</span>
                </div>

                <div className="h-3 bg-[#1e293b] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 transition-all duration-700"
                    style={{ width: `${stepProgress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* HEART */}

            <div className="col-span-12 lg:col-span-4 bg-[#0f172a] rounded-2xl p-8 shadow border border-[#1e293b] flex flex-col items-center">
              <p className="text-xs font-bold text-slate-400 uppercase mb-6">
                Live Pulse
              </p>

              <PulseHeart
                bpm={metrics.heartRate.current}
                trendData={metrics.heartRate.trend}
              />

              <div className="mt-6 text-center">
                <span className="text-5xl font-black text-white">
                  {metrics.heartRate.current}
                </span>

                <p className="text-red-400 font-bold text-xs uppercase">
                  Beats Per Minute
                </p>
              </div>
            </div>

            {/* OXYGEN */}

            <div className="col-span-12 xl:col-span-4">
              <OxygenWave
                spo2={metrics.spo2.current}
                trendData={metrics.spo2.trend}
              />
            </div>

            {/* STRESS */}

            <div className="col-span-12 xl:col-span-4">
              <StressRadar
                gsr={metrics.gsr.current}
                trendData={metrics.gsr.trend}
                threshold={thresholds.gsrMax}
              />
            </div>

            {/* TEMPERATURE */}

            <div className="col-span-12 xl:col-span-4">
              <TemperatureHub
                temp={metrics.temperature.current}
                trendData={metrics.temperature.trend}
                thresholds={thresholds}
              />
            </div>

            {/* TREND */}

            <div className="col-span-12 lg:col-span-8">
              <TrendChart metricsData={metrics} />
            </div>

            {/* ALERTS */}

            <div className="w-full col-span-12 lg:col-span-4 space-y-6">
              <AlertSection
                metrics={metrics}
                thresholds={thresholds}
                isNotificationEnabled={isNotificationEnabled}
              />
            </div>

            <div className="bg-[#0f172a] w-100 px-5 py-3 rounded-xl shadow border border-[#1e293b] flex items-center gap-3">
              <button
                onClick={() => setActiveTab("Settings")}
                className="flex items-center gap-3 p-3 cursor-pointer rounded-lg w-full text-slate-400 hover:bg-[#020617] hover:text-slate-200 transition-all"
              >
                <Cog6ToothIcon className="h-5 w-5" />

                <span>Change Thresholds</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === "Settings" && (
          <SettingsSection
            currentThresholds={thresholds}
            goHome={() => setActiveTab("Home")}
          />
        )}
      </main>
    </div>
  );
};

export default Dashboard;
