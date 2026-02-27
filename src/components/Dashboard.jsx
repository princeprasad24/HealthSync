// src/components/Dashboard.jsx
import React, { useState, useEffect } from "react";
import Sidebar from "./sideBar";
import DailyGoalCard from "./DailyGoalCard";
import TrendChart from "./TrendChart";
import AlertSection from "./AlertSection";
import { database } from "../firebase/firebase";
import { ref, onValue } from "firebase/database";
import { Activity, Footprints, Droplets, Thermometer, Zap } from "lucide-react";

const Dashboard = () => {
  // 1. State Management
  const [activeTab, setActiveTab] = useState("Home");
  const [isNotificationEnabled, setNotificationEnabled] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [metrics, setMetrics] = useState({
    heartRate: { current: 0, target: 100, trend: [70, 72, 75, 74, 78] },
    spo2: { current: 0, target: 100, trend: [98, 99, 97, 98, 98] },
    steps: { current: 0, target: 10000, trend: [1000, 2000, 3500, 4000, 5000] },
    gsr: { current: 0, target: 1, trend: [0.4, 0.5, 0.45, 0.6, 0.5] },
    temperature: { current: 0, target: 37.5, trend: [36.5, 36.6, 36.7, 36.6, 36.8] },
    isFallen: false
  });

  // 2. Real-time Firebase Listener
  useEffect(() => {
    const metricsRef = ref(database, "metrics");
    const unsubscribe = onValue(metricsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setMetrics(prev => ({ ...prev, ...data }));
      }
    });

    // Mock FCM Setup Status for UI
    setNotificationEnabled(true); 

    return () => unsubscribe();
  }, []);

  // 3. Alert Generation Logic
  useEffect(() => {
    const newAlerts = [];
    if (metrics.heartRate.current > 120) {
      newAlerts.push({ id: 1, type: "Heart Rate", message: "High heart rate detected!", severity: "high" });
    }
    if (metrics.spo2.current < 95) {
      newAlerts.push({ id: 2, type: "SpO₂", message: "Oxygen level low!", severity: "medium" });
    }
    if (metrics.temperature.current > 38) {
      newAlerts.push({ id: 3, type: "Temperature", message: "Fever detected!", severity: "high" });
    }
    if (metrics.isFallen) {
      newAlerts.push({ id: 4, type: "Safety", message: "Emergency: Fall Detected!", severity: "high" });
    }
    if (metrics.gsr.current > 0.8) {
      newAlerts.push({ id: 5, type: "Stress", message: "High stress levels detected.", severity: "medium" });
    }
    setAlerts(newAlerts);
  }, [metrics]);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      
      
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 p-4 md:p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back!</h1>
          <p className="text-gray-500">Here is your health overview for today.</p>
        </header>

        {/* Dynamic Content based on Sidebar */}
        {activeTab === "Home" && (
          <>
            {/* Daily Goal Cards Grid */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
              <DailyGoalCard
                title="Steps"
                currentValue={metrics.steps.current}
                targetValue={metrics.steps.target}
                trendData={metrics.steps.trend}
                color="#10b981"
                unit=" steps"
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
                title="Stress (GSR)"
                currentValue={metrics.gsr.current}
                targetValue={metrics.gsr.target}
                trendData={metrics.gsr.trend}
                color="#f59e0b"
                unit=" level"
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
              <div>
                <AlertSection alerts={alerts} isNotificationEnabled={isNotificationEnabled} />
                
                {/* Fall Detection Quick Status */}
                <div className={`mt-6 p-6 rounded-2xl border-2 transition-all ${metrics.isFallen ? 'bg-red-600 border-red-600 text-white animate-bounce' : 'bg-white border-gray-100 text-gray-400'}`}>
                   <p className="text-sm font-bold uppercase mb-1">Safety Status</p>
                   <p className="text-2xl font-black">{metrics.isFallen ? "FALL DETECTED!" : "System Normal"}</p>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab !== "Home" && (
          <div className="h-64 flex items-center justify-center bg-white rounded-2xl border border-dashed border-gray-200">
            <p className="text-gray-400">Detailed {activeTab} analytics coming soon...</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;