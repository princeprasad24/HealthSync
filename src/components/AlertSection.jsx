import React from "react";
import { 
  Bell, 
  AlertTriangle, 
  ShieldCheck, 
  Activity,
  Zap,
  Droplets,
  Thermometer,
  X
} from "lucide-react";

const AlertSection = ({ metrics, thresholds, isNotificationEnabled, onDismissAll }) => {
  
  // Logic to generate dynamic alerts based on your provided ranges
  const generateLiveAlerts = () => {
    const activeAlerts = [];
    const { heartRate, spo2, temperature, gsr, isFallen } = metrics;

    // 1. FALL DETECTION (Highest Priority)
    if (isFallen) {
      activeAlerts.push({
        id: "fall",
        type: "Emergency",
        message: "Fall Detected! Immediate contact recommended.",
        severity: "high",
        icon: <AlertTriangle className="text-red-600" />
      });
    }

    // 2. HEART RATE RANGES
    if (heartRate.current > 200) {
      activeAlerts.push({ id: "hr-crit", type: "Heart Rate", message: "Dangerously high BPM (>200).", severity: "high", icon: <Activity /> });
    } else if (heartRate.current > thresholds.hrMax) {
      activeAlerts.push({ id: "hr-warn", type: "Heart Rate", message: "Pulse above set limit.", severity: "medium", icon: <Activity /> });
    }

    // 3. GSR STRESS RANGES (Based on your new data)
    if (gsr.current >= 1500) {
      activeAlerts.push({ 
        id: "gsr-high", 
        type: "Stress Level", 
        message: "High stress / sweating detected.", 
        severity: "high", 
        icon: <Droplets className="text-orange-600" /> 
      });
    } else if (gsr.current >= 500 && gsr.current < 1500) {
      activeAlerts.push({ 
        id: "gsr-med", 
        type: "Stress Level", 
        message: "Slight stress detected.", 
        severity: "medium", 
        icon: <Droplets className="text-yellow-600" /> 
      });
    }

    // 4. SPO2 & TEMP
    if (spo2.current > 0 && spo2.current < thresholds.spo2Min) {
      activeAlerts.push({ id: "spo2", type: "Oxygen", message: `SpO2 below ${thresholds.spo2Min}%.`, severity: "medium", icon: <Zap /> });
    }
    if (temperature.current > thresholds.tempMax) {
      activeAlerts.push({ id: "temp", type: "Temperature", message: "Fever threshold exceeded.", severity: "high", icon: <Thermometer /> });
    }

    return activeAlerts;
  };

  const currentAlerts = generateLiveAlerts();

  const getSeverityStyles = (severity) => {
    switch (severity) {
      case "high": return "bg-red-50 text-red-700 border-red-200 ring-1 ring-red-500/20";
      case "medium": return "bg-yellow-50 text-yellow-700 border-yellow-200 ring-1 ring-yellow-500/20";
      default: return "bg-blue-50 text-blue-700 border-blue-200 ring-1 ring-blue-500/20";
    }
  };

  return (
    <div className="bg-white shadow-sm border border-gray-100 rounded-3xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Health Alerts</h2>
        <div className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase ${isNotificationEnabled ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"}`}>
          {isNotificationEnabled ? "Live" : "Muted"}
        </div>
      </div>

      {currentAlerts.length === 0 ? (
        <div className="flex flex-col items-center py-8 bg-gray-50 rounded-2xl border border-dashed">
          <ShieldCheck className="h-8 w-8 text-green-500 mb-2" />
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">System Clear</p>
        </div>
      ) : (
        <div className="space-y-3">
          {currentAlerts.map((alert) => (
            <div key={alert.id} className={`flex items-start gap-4 p-4 border-l-4 rounded-2xl transition-all ${getSeverityStyles(alert.severity)}`}>
              <div className="mt-1">{alert.icon}</div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <p className="font-black text-[10px] uppercase tracking-wider">{alert.type}</p>
                  <span className="text-[8px] font-bold uppercase opacity-50">{alert.severity}</span>
                </div>
                <p className="text-xs font-semibold mt-0.5 leading-tight">{alert.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AlertSection;