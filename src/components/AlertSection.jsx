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

const AlertSection = ({ metrics, thresholds, isNotificationEnabled }) => {
  
  // Generate all alerts dynamically
  const generateLiveAlerts = () => {
    const activeAlerts = [];
    const { heartRate, spo2, temperature, gsr, isFallen } = metrics;

    // --- 1. FALL DETECTION (Highest Priority) ---
    if (isFallen) {
      activeAlerts.push({
        id: "fall",
        type: "Emergency",
        message: "Fall Detected! Immediate contact recommended.",
        severity: "high",
        icon: <AlertTriangle className="text-red-600" />
      });
    }

    if (heartRate.current > 0) {
    if (heartRate.current > thresholds.hrMax) {
      activeAlerts.push({ id: "h-hr", type: "Heart Rate", message: `High Pulse (> ${thresholds.hrMax} BPM)`, severity: "high" });
    } else if (heartRate.current < thresholds.hrMin) {
      activeAlerts.push({ id: "l-hr", type: "Heart Rate", message: `Low Pulse (< ${thresholds.hrMin} BPM)`, severity: "high" });
    }
  }

  if (temperature.current > 0) {
    if (temperature.current > thresholds.tempMax) {
      activeAlerts.push({ id: "h-temp", type: "Temperature", message: "Fever Detected", severity: "high" });
    } else if (temperature.current < thresholds.tempMin) {
      activeAlerts.push({ id: "l-temp", type: "Temperature", message: "Low Body Temp Detected", severity: "high" });
    }
  }

  if (spo2.current > 0 && spo2.current < thresholds.spo2Min) {
    activeAlerts.push({ id: "l-spo2", type: "Oxygen", message: `Critical SpO2: ${spo2.current}%`, severity: "high" });
  }

  // GSR: Stress Levels
  if (gsr.current >= 1500) {
    activeAlerts.push({ id: "gsr", type: "Stress", message: "High Stress detected", severity: "medium" });
  }

    // --- 2. HEART RATE ALERTS ---
    if (heartRate.current > 0) {
      if (heartRate.current > 200) {
        activeAlerts.push({
          id: "hr-crit-high",
          type: "Heart Rate",
          message: "CRITICAL: Dangerously High BPM (>200)!",
          severity: "high",
          icon: <Activity className="text-red-600" />
        });
      } else if (heartRate.current > thresholds.hrMax) {
        activeAlerts.push({
          id: "hr-high",
          type: "Heart Rate",
          message: "High Pulse detected.",
          severity: "medium",
          icon: <Activity />
        });
      } else if (heartRate.current < 40) {
        activeAlerts.push({
          id: "hr-crit-low",
          type: "Heart Rate",
          message: "CRITICAL: Dangerously Low BPM (<40)!",
          severity: "high",
          icon: <Activity className="text-blue-600" />
        });
      } else if (heartRate.current < 55) {
        activeAlerts.push({
          id: "hr-low",
          type: "Heart Rate",
          message: "Low Pulse (Bradycardia) detected.",
          severity: "medium",
          icon: <Activity />
        });
      }
    }

    // --- 3. TEMPERATURE ALERTS ---
    if (temperature.current > 0) {
      if (temperature.current > thresholds.tempMax) {
        activeAlerts.push({
          id: "temp-high",
          type: "Temperature",
          message: "Fever detected (High Temp).",
          severity: "high",
          icon: <Thermometer className="text-red-600" />
        });
      } else if (temperature.current < 35.0) {
        activeAlerts.push({
          id: "temp-low",
          type: "Temperature",
          message: "CRITICAL: Low Body Temp (Hypothermia)!",
          severity: "high",
          icon: <Thermometer className="text-blue-600" />
        });
      }
    }

    // --- 4. SPO2 ALERTS ---
    if (spo2.current > 0 && spo2.current < thresholds.spo2Min) {
      const severity = spo2.current < 85 ? "high" : "medium";
      activeAlerts.push({
        id: "spo2-low",
        type: "Oxygen",
        message: `Low SpO2 detected: ${spo2.current}%.`,
        severity,
        icon: <Zap />
      });
    }

    // --- 5. GSR STRESS ALERTS ---
    if (gsr.current >= 1500) {
      activeAlerts.push({
        id: "gsr-high",
        type: "Stress Level",
        message: "High stress / sweating detected.",
        severity: "high",
        icon: <Droplets className="text-orange-600" />
      });
    } else if (gsr.current >= 1200 && gsr.current < 1500) {
      activeAlerts.push({
        id: "gsr-med",
        type: "Stress Level",
        message: "Slight stress detected.",
        severity: "medium",
        icon: <Droplets className="text-yellow-600" />
      });
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