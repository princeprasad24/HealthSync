import React from "react";
import {
  Bell,
  BellOff,
  AlertTriangle,
  ShieldCheck,
  X
} from "lucide-react";

const AlertSection = ({
  metrics,
  thresholds,
  isNotificationEnabled,
  onDismissAll
}) => {

  /* -------- Generate Alerts Using Thresholds -------- */

  const alerts = [];

  if (metrics?.isFallen) {
    alerts.push({
      id: 1,
      type: "Fall Detection",
      message: "Fall detected! Immediate attention required.",
      severity: "high"
    });
  }

  if (metrics?.heartRate?.current > thresholds?.hrMax) {
    alerts.push({
      id: 2,
      type: "Heart Rate",
      message: `Heart rate exceeded ${thresholds.hrMax} BPM`,
      severity: "high"
    });
  }

  if (
    metrics?.spo2?.current > 0 &&
    metrics?.spo2?.current < thresholds?.spo2Min
  ) {
    alerts.push({
      id: 3,
      type: "Oxygen Level",
      message: `SpO₂ dropped below ${thresholds.spo2Min}%`,
      severity: "medium"
    });
  }

  if (metrics?.temperature?.current > thresholds?.tempMax) {
    alerts.push({
      id: 4,
      type: "Body Temperature",
      message: `Temperature above ${thresholds.tempMax}°C`,
      severity: "high"
    });
  }

  if (metrics?.gsr?.current > 3000) {
    alerts.push({
      id: 5,
      type: "Stress Level",
      message: "High stress detected from GSR sensor",
      severity: "low"
    });
  }

  /* -------- Severity Colors -------- */

  const getSeverityStyles = (severity) => {
    switch (severity) {
      case "high":
        return "bg-red-50 text-red-700 border-red-200 ring-1 ring-red-500/20";
      case "medium":
        return "bg-yellow-50 text-yellow-700 border-yellow-200 ring-1 ring-yellow-500/20";
      default:
        return "bg-blue-50 text-blue-700 border-blue-200 ring-1 ring-blue-500/20";
    }
  };

  return (
    <div className="bg-white shadow-sm border border-gray-100 rounded-3xl p-6 transition-all duration-500">

      {/* Header */}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">

        <div>
          <h2 className="text-xl font-bold text-gray-800">
            Live Health Alerts
          </h2>

          <div className="flex items-center gap-2 mt-1">
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>

            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              IoT Firebase Connected
            </span>
          </div>
        </div>

        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all ${
            isNotificationEnabled
              ? "bg-green-50 border-green-100 text-green-700"
              : "bg-gray-50 border-gray-100 text-gray-400"
          }`}
        >
          {isNotificationEnabled ? <Bell size={14} /> : <BellOff size={14} />}
          <span className="text-[10px] font-black uppercase">
            {isNotificationEnabled ? "Monitoring" : "Muted"}
          </span>
        </div>
      </div>

      {/* Alerts List */}

      {alerts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">

          <div className="bg-green-100 p-3 rounded-2xl mb-3">
            <ShieldCheck className="h-6 w-6 text-green-600" />
          </div>

          <p className="text-gray-800 font-bold text-sm">
            All Vitals Normal
          </p>

          <p className="text-[10px] text-gray-400 uppercase font-medium mt-1">
            No issues detected
          </p>

        </div>
      ) : (

        <div className="flex flex-col gap-3">

          {alerts.map((alert) => (

            <div
              key={alert.id}
              className={`flex items-start gap-4 p-4 border-l-4 rounded-2xl ${getSeverityStyles(alert.severity)}`}
            >

              <div className="mt-1">
                {alert.severity === "high" ? (
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                ) : (
                  <Bell className="h-5 w-5" />
                )}
              </div>

              <div className="flex-1">

                <div className="flex justify-between items-start">

                  <p className="font-black text-xs uppercase tracking-tight">
                    {alert.type}
                  </p>

                  <span className="text-[8px] font-black uppercase bg-white/50 px-1.5 py-0.5 rounded shadow-sm">
                    {alert.severity}
                  </span>

                </div>

                <p className="text-xs font-medium opacity-90 mt-1">
                  {alert.message}
                </p>

              </div>

            </div>

          ))}

          {alerts.length > 1 && (
            <button
              onClick={onDismissAll}
              className="mt-2 text-[10px] font-bold text-gray-400 hover:text-gray-600 uppercase tracking-widest flex items-center justify-center gap-1 transition-colors"
            >
              <X size={12} /> Clear Current Alerts
            </button>
          )}

        </div>
      )}

    </div>
  );
};

export default AlertSection;