import React, { useState, useEffect } from "react";
import Sidebar from "./sideBar";
import DailyGoalCard from "./DailyGoalCard";
import TrendChart from "./TrendChart";
import AlertSection from "./AlertSection";
import SettingsSection from "./SettingsSection";

import { database } from "../firebase/firebase";
import { ref, onValue } from "firebase/database";

import {
  Activity,
  Footprints,
  Droplets,
  Thermometer,
  Zap
} from "lucide-react";

const Dashboard = () => {

  const [activeTab, setActiveTab] = useState("Home");
  const [isNotificationEnabled, setNotificationEnabled] = useState(true);
  const [lastUpdate, setLastUpdate] = useState("");

 

  const [thresholds, setThresholds] = useState({
    hrMax: 120,
    tempMax: 38,
    spo2Min: 94
  });

 

  const [metrics, setMetrics] = useState({
    heartRate: { current: 0, target: 100, trend: [] },
    spo2: { current: 0, target: 100, trend: [] },
    steps: { current: 0, target: 10000, trend: [] },
    gsr: { current: 0, target: 4095, trend: [] },
    temperature: { current: 0, target: 37.5, trend: [] },
    isFallen: false
  });

 

  const updateTrend = (trendArray, newValue) => {
    const newTrend = [...trendArray, newValue];
    return newTrend.slice(-20);
  };

 

  useEffect(() => {

    const thresholdRef = ref(database, "thresholds");

    const unsubscribe = onValue(thresholdRef, (snapshot) => {

      if (snapshot.exists()) {
        setThresholds(snapshot.val());
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
          sensors.temperature && sensors.temperature !== -127
            ? sensors.temperature
            : prev.temperature.current;

        return {

          ...prev,

          heartRate: {
            ...prev.heartRate,
            current: health.heartRate ?? prev.heartRate.current,
            trend: health.heartRate
              ? updateTrend(prev.heartRate.trend, health.heartRate)
              : prev.heartRate.trend
          },

          spo2: {
            ...prev.spo2,
            current: health.spo2 ?? prev.spo2.current,
            trend: health.spo2
              ? updateTrend(prev.spo2.trend, health.spo2)
              : prev.spo2.trend
          },

          steps: {
            ...prev.steps,
            current: sensors.steps ?? prev.steps.current,
            trend: sensors.steps
              ? updateTrend(prev.steps.trend, sensors.steps)
              : prev.steps.trend
          },

          gsr: {
            ...prev.gsr,
            current: sensors.gsr ?? prev.gsr.current,
            trend: sensors.gsr
              ? updateTrend(prev.gsr.trend, sensors.gsr)
              : prev.gsr.trend
          },

          temperature: {
            ...prev.temperature,
            current: validTemp,
            trend:
              validTemp !== prev.temperature.current
                ? updateTrend(prev.temperature.trend, validTemp)
                : prev.temperature.trend
          },

          isFallen: health.isFallen || sensors.isFallen || false
        };

      });

      setLastUpdate(new Date().toLocaleTimeString());

    });

    return () => unsubscribe();

  }, []);

 

  return (

    <div className="min-h-screen bg-gray-50 flex">

      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <main className="flex-1 p-4 md:p-8">

        {/* Header */}

        <header className="mb-8 flex justify-between items-end">

          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Health Dashboard
            </h1>

            <p className="text-gray-500">
              Real-time vitals monitoring from IoT sensors
            </p>
          </div>

          <div className="hidden md:block text-right">
            <p className="text-xs font-bold text-gray-400 uppercase">
              Last Update
            </p>

            <p className="text-sm font-medium text-gray-600">
              {lastUpdate}
            </p>
          </div>

        </header>

        {/* HOME TAB */}

        {activeTab === "Home" && (

          <>

            {/* Vitals Cards */}

            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">

              <DailyGoalCard
                title="Steps"
                currentValue={metrics.steps.current}
                targetValue={metrics.steps.target}
                trendData={metrics.steps.trend}
                color="#10b981"
                icon={Footprints}
                chartType="bar"
              />

              <DailyGoalCard
                title="Heart Rate"
                currentValue={metrics.heartRate.current}
                targetValue={thresholds.hrMax}
                trendData={metrics.heartRate.trend}
                color="#ef4444"
                icon={Activity}
                unit=" BPM"
              />

              <DailyGoalCard
                title="SpO₂"
                currentValue={metrics.spo2.current}
                targetValue={100}
                trendData={metrics.spo2.trend}
                color="#3b82f6"
                icon={Zap}
                unit="%"
              />

              <DailyGoalCard
                title="GSR"
                currentValue={metrics.gsr.current}
                targetValue={4095}
                trendData={metrics.gsr.trend}
                color="#f59e0b"
                icon={Droplets}
              />

              {/* <DailyGoalCard
                title="Temp"
                currentValue={metrics.temperature.current}
                targetValue={thresholds.tempMax}
                trendData={metrics.temperature.trend}
                color="#ec4899"
                icon={Thermometer}
                unit="°C"
              /> */}

            </section>

            {/* Charts + Alerts */}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* Chart */}

              <div className="lg:col-span-2">
                <TrendChart metricsData={metrics} />
              </div>

              {/* Alerts */}

              <div className="space-y-6">

                <AlertSection
                  metrics={metrics}
                  thresholds={thresholds}
                  isNotificationEnabled={isNotificationEnabled}
                />

                {/* Fall Detection Indicator */}

                <div
                  className={`p-6 rounded-2xl border-2 transition-all duration-500 ${
                    metrics.isFallen
                      ? "bg-red-600 border-red-400 text-white animate-pulse"
                      : "bg-white border-gray-100 text-gray-400"
                  }`}
                >

                  <p className="text-xs font-bold uppercase mb-1">
                    Safety Status
                  </p>

                  <p className="text-2xl font-black">
                    {metrics.isFallen
                      ? "FALL DETECTED!"
                      : "SYSTEM NORMAL"}
                  </p>

                </div>

              </div>

            </div>

          </>

        )}

        {/* SETTINGS TAB */}

        {activeTab === "Settings" && (

          <SettingsSection
            currentThresholds={thresholds}
          />

        )}

        {/* Placeholder Tabs */}

        {activeTab !== "Home" && activeTab !== "Settings" && (

          <div className="h-64 flex flex-col items-center justify-center bg-white rounded-3xl border border-dashed border-gray-200">

            <Activity className="h-10 w-10 text-gray-200 mb-2" />

            <p className="text-gray-400 font-medium">
              {activeTab} Analytics Coming Soon
            </p>

          </div>

        )}

      </main>

    </div>

  );
};

export default Dashboard;