import React from "react";
import {
  AlertTriangle,
  ShieldCheck,
  Activity,
  Zap,
  Droplets,
  Thermometer,
} from "lucide-react";

const AlertSection = ({ metrics, thresholds, isNotificationEnabled }) => {

  const generateLiveAlerts = () => {

    const activeAlerts = [];
    const { heartRate, spo2, temperature, gsr, isFallen } = metrics;

    /* FALL DETECTION */

    if (isFallen) {
      activeAlerts.push({
        id: "fall",
        type: "Emergency",
        message: "Fall Detected! Immediate contact recommended.",
        severity: "high",
        icon: <AlertTriangle className="text-red-500" />,
      });
    }

    /* HEART RATE */

    if (heartRate.current > 0) {

      if (heartRate.current > 200) {
        activeAlerts.push({
          id: "hr-crit-high",
          type: "Heart Rate",
          message: "CRITICAL: Dangerously High BPM (>200)!",
          severity: "high",
          icon: <Activity className="text-red-500" />,
        });

      } else if (heartRate.current > thresholds.hrMax) {

        activeAlerts.push({
          id: "hr-high",
          type: "Heart Rate",
          message: `High Pulse (> ${thresholds.hrMax})`,
          severity: "medium",
          icon: <Activity className="text-orange-400" />,
        });

      } else if (heartRate.current < 40) {

        activeAlerts.push({
          id: "hr-crit-low",
          type: "Heart Rate",
          message: "CRITICAL: Dangerously Low BPM (<40)!",
          severity: "high",
          icon: <Activity className="text-blue-400" />,
        });

      } else if (heartRate.current < thresholds.hrMin) {

        activeAlerts.push({
          id: "hr-low",
          type: "Heart Rate",
          message: `Low Pulse (< ${thresholds.hrMin})`,
          severity: "medium",
          icon: <Activity className="text-blue-300" />,
        });
      }
    }

    /* TEMPERATURE */

    if (temperature.current > 0) {

      if (temperature.current > thresholds.tempMax) {
        activeAlerts.push({
          id: "temp-high",
          type: "Temperature",
          message: "Fever detected.",
          severity: "high",
          icon: <Thermometer className="text-red-500" />,
        });

      } else if (temperature.current < thresholds.tempMin) {

        activeAlerts.push({
          id: "temp-low",
          type: "Temperature",
          message: "Low Body Temperature.",
          severity: "high",
          icon: <Thermometer className="text-blue-400" />,
        });
      }
    }

    /* SPO2 */

    if (spo2.current > 0 && spo2.current < thresholds.spo2Min) {

      const severity = spo2.current < 85 ? "high" : "medium";

      activeAlerts.push({
        id: "spo2-low",
        type: "Oxygen",
        message: `Low SpO2: ${spo2.current}%`,
        severity,
        icon: <Zap className="text-cyan-400" />,
      });
    }

    /* GSR STRESS */

    if (gsr.current >= 1500) {

      activeAlerts.push({
        id: "gsr-high",
        type: "Stress",
        message: "High stress detected.",
        severity: "high",
        icon: <Droplets className="text-orange-400" />,
      });

    } else if (gsr.current >= 500) {

      activeAlerts.push({
        id: "gsr-med",
        type: "Stress",
        message: "Slight stress detected.",
        severity: "medium",
        icon: <Droplets className="text-yellow-400" />,
      });
    }

    return activeAlerts;
  };

  const currentAlerts = generateLiveAlerts();

  const getSeverityStyles = (severity) => {

    switch (severity) {

      case "high":
        return "bg-red-500/10 text-red-400 border-red-500/30";

      case "medium":
        return "bg-yellow-500/10 text-yellow-300 border-yellow-500/30";

      default:
        return "bg-blue-500/10 text-blue-300 border-blue-500/30";
    }
  };

  return (

    <div className="bg-[#0f172a] shadow border border-[#1e293b] rounded-2xl p-6">

      {/* HEADER */}

      <div className="flex justify-between items-center mb-6">

        <h2 className="text-xl font-bold text-slate-200">
          Health Alerts
        </h2>

        <div
          className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase
          ${
            isNotificationEnabled
              ? "bg-green-500/20 text-green-400"
              : "bg-slate-700 text-slate-400"
          }`}
        >
          {isNotificationEnabled ? "Live" : "Muted"}
        </div>

      </div>

      {/* EMPTY STATE */}

      {currentAlerts.length === 0 ? (

        <div className="flex flex-col items-center py-8 bg-[#020617] rounded-xl border border-dashed border-[#1e293b]">

          <ShieldCheck className="h-8 w-8 text-green-400 mb-2" />

          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            System Clear
          </p>

        </div>

      ) : (

        <div className="space-y-3">

          {currentAlerts.map((alert) => (

            <div
              key={alert.id}
              className={`flex items-start gap-4 p-4 border-l-4 rounded-xl transition-all ${getSeverityStyles(
                alert.severity
              )}`}
            >

              <div className="mt-1">{alert.icon}</div>

              <div className="flex-1">

                <div className="flex justify-between">

                  <p className="font-black text-[10px] uppercase tracking-wider">
                    {alert.type}
                  </p>

                  <span className="text-[8px] font-bold uppercase opacity-60">
                    {alert.severity}
                  </span>

                </div>

                <p className="text-xs font-semibold mt-1 leading-tight">
                  {alert.message}
                </p>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
};

export default AlertSection;