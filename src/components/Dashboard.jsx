import React, { useState, useEffect } from "react";
import Sidebar from "./sideBar";
import DailyGoalCard from "./DailyGoalCard";
import TrendChart from "./TrendChart";
import AlertSection from "./AlertSection";
import { database } from "../firebase/firebase";
import { ref, onValue } from "firebase/database";
import { Activity, Footprints, Droplets, Thermometer, Zap } from "lucide-react";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("Home");
  const [isNotificationEnabled, setNotificationEnabled] = useState(true);
  const [alerts, setAlerts] = useState([]);
  
  const [metrics, setMetrics] = useState({
    heartRate: { current: 0, target: 100, trend: [] },
    spo2: { current: 0, target: 100, trend: [] },
    steps: { current: 0, target: 10000, trend: [] },
    gsr: { current: 0, target: 2000, trend: [] }, // Adjusted target for raw GSR range
    temperature: { current: 0, target: 37.5, trend: [] },
    isFallen: false
  });

  // Helper function to update trend arrays (stores last 20 readings)
  const updateTrend = (trendArray, newValue) => {
    const newTrend = [...trendArray, newValue];
    return newTrend.slice(-20); // Keep only the latest 20 points for the sparklines
  };

  useEffect(() => {
    const rootRef = ref(database, "/");
    console.log("Listening to Firebase for real-time updates...");

    const unsubscribe = onValue(rootRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const health = data.healthData || {};
        const sensors = data.sensorData || {};

        setMetrics((prev) => {
          // Logic for valid temperature (ignoring -127 error state)
          const newTemp = sensors.temperature && sensors.temperature !== -127 
            ? sensors.temperature 
            : prev.temperature.current;

          return {
            ...prev,
            heartRate: {
              ...prev.heartRate,
              current: health.heartRate ?? prev.heartRate.current,
              trend: health.heartRate ? updateTrend(prev.heartRate.trend, health.heartRate) : prev.heartRate.trend
            },
            spo2: {
              ...prev.spo2,
              current: health.spo2 ?? prev.spo2.current,
              trend: health.spo2 ? updateTrend(prev.spo2.trend, health.spo2) : prev.spo2.trend
            },
            steps: {
              ...prev.steps,
              current: sensors.steps ?? prev.steps.current,
              trend: sensors.steps ? updateTrend(prev.steps.trend, sensors.steps) : prev.steps.trend
            },
            gsr: {
              ...prev.gsr,
              current: sensors.gsr ?? prev.gsr.current,
              trend: sensors.gsr ? updateTrend(prev.gsr.trend, sensors.gsr) : prev.gsr.trend
            },
            temperature: {
              ...prev.temperature,
              current: newTemp,
              trend: newTemp !== prev.temperature.current ? updateTrend(prev.temperature.trend, newTemp) : prev.temperature.trend
            },
            isFallen: health.isFallen || sensors.isFallen || false,
          };
        });
      }
    });

    return () => unsubscribe();
  }, []);

  // Centralized Alert Logic
  useEffect(() => {
    const newAlerts = [];
    const { heartRate, spo2, temperature, isFallen, gsr } = metrics;

    if (isFallen) {
      newAlerts.push({ id: 1, type: "Emergency", message: "Fall Detected! Immediate attention required.", severity: "high" });
    }
    if (heartRate.current > 120) {
      newAlerts.push({ id: 2, type: "Heart Rate", message: "High heart rate (Tachycardia) detected.", severity: "high" });
    }
    if (spo2.current > 0 && spo2.current < 94) {
      newAlerts.push({ id: 3, type: "Oxygen", message: "SpO2 levels dropped below normal.", severity: "medium" });
    }
    if (temperature.current > 38) {
      newAlerts.push({ id: 4, type: "Temperature", message: "High fever detected.", severity: "high" });
    }
    if (gsr.current > 3000) {
        newAlerts.push({ id: 5, type: "Stress", message: "Extreme stress levels detected.", severity: "low" });
    }

    setAlerts(newAlerts);
  }, [metrics]);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 p-4 md:p-8">
        <header className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Health Overview</h1>
            <p className="text-gray-500">Real-time vitals monitoring from IoT sensors.</p>
          </div>
          <div className="text-right hidden md:block">
             <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Last Update</p>
             <p className="text-sm font-medium text-gray-600">{new Date().toLocaleTimeString()}</p>
          </div>
        </header>

        {activeTab === "Home" && (
          <>
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
              <DailyGoalCard
                title="Steps"
                currentValue={metrics.steps.current}
                targetValue={metrics.steps.target}
                trendData={metrics.steps.trend}
                color="#10b981"
                unit=""
                icon={Footprints}
                chartType="bar"
              />
              <DailyGoalCard
                title="Heart Rate"
                currentValue={metrics.heartRate.current}
                targetValue={metrics.heartRate.target}
                trendData={metrics.heartRate.trend}
                color="#ef4444"
                unit=" BPM"
                icon={Activity}
              />
              <DailyGoalCard
                title="SpO₂"
                currentValue={metrics.spo2.current}
                targetValue={metrics.spo2.target}
                trendData={metrics.spo2.trend}
                color="#3b82f6"
                unit="%"
                icon={Zap}
              />
              <DailyGoalCard
                title="GSR"
                currentValue={metrics.gsr.current}
                targetValue={metrics.gsr.target}
                trendData={metrics.gsr.trend}
                color="#f59e0b"
                unit=""
                icon={Droplets}
              />
              <DailyGoalCard
                title="Body Temp"
                currentValue={metrics.temperature.current}
                targetValue={metrics.temperature.target}
                trendData={metrics.temperature.trend}
                color="#ec4899"
                unit="°C"
                icon={Thermometer}
              />
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <TrendChart metricsData={metrics} />
              </div>
              <div className="space-y-6">
                <AlertSection alerts={alerts} isNotificationEnabled={isNotificationEnabled} />
                
                {/* Visual Fall Indicator */}
                <div className={`p-6 rounded-2xl border-2 transition-all duration-500 ${
                  metrics.isFallen 
                    ? 'bg-red-600 border-red-400 text-white shadow-lg shadow-red-200 animate-pulse' 
                    : 'bg-white border-gray-100 text-gray-400'
                }`}>
                   <p className="text-xs font-bold uppercase mb-1 tracking-tighter">Safety Status</p>
                   <p className="text-2xl font-black">
                     {metrics.isFallen ? "FALL DETECTED!" : "SYSTEM NORMAL"}
                   </p>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab !== "Home" && (
          <div className="h-64 flex flex-col items-center justify-center bg-white rounded-3xl border border-dashed border-gray-200">
            <Activity className="h-10 w-10 text-gray-200 mb-2" />
            <p className="text-gray-400 font-medium">{activeTab} Analytics Coming Soon</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;