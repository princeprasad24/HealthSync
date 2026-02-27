// src/components/AlertSection.jsx
import React from "react";
import { 
  BellAlertIcon, 
  BellSlashIcon, 
  ExclamationTriangleIcon, 
  ShieldCheckIcon,
  CloudIcon
} from "@heroicons/react/24/outline"; // or use lucide equivalents like Bell, BellOff, AlertTriangle, ShieldCheck, Cloud

const AlertSection = ({ alerts, isNotificationEnabled }) => {
  const getSeverityStyles = (severity) => {
    switch (severity) {
      case "high":
        return "bg-red-50 text-red-700 border-red-200 ring-1 ring-red-500/20";
      case "medium":
        return "bg-yellow-50 text-yellow-700 border-yellow-200 ring-1 ring-yellow-500/20";
      case "low":
      default:
        return "bg-blue-50 text-blue-700 border-blue-200 ring-1 ring-blue-500/20";
    }
  };

  return (
    <div className="bg-white shadow-sm border border-gray-100 rounded-2xl p-6 mt-8">
      {/* Header with FCM Status */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            System Alerts
            {alerts.length > 0 && (
              <span className="flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
            )}
          </h2>
          <p className="text-sm text-gray-400">Real-time health monitoring notifications</p>
        </div>

        {/* Firebase Cloud Messaging Status Indicator */}
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all
          ${isNotificationEnabled ? "bg-green-50 text-green-700 border-green-200" : "bg-gray-50 text-gray-400 border-gray-200"}`}>
          <CloudIcon className="h-4 w-4" />
          <span>FCM Cloud: {isNotificationEnabled ? "Active" : "Disabled"}</span>
        </div>
      </div>

      {/* Alerts Content */}
      {alerts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center border-2 border-dashed border-gray-100 rounded-xl">
          <div className="bg-green-50 p-3 rounded-full mb-3">
            <ShieldCheckIcon className="h-8 w-8 text-green-500" />
          </div>
          <p className="text-gray-500 font-medium">All Vitals Normal</p>
          <p className="text-xs text-gray-400">No critical issues detected at this time.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`flex items-start gap-4 p-4 border-l-4 rounded-xl transition-all duration-300 ${getSeverityStyles(alert.severity)}`}
            >
              <div className="mt-0.5">
                {alert.severity === "high" ? (
                  <ExclamationTriangleIcon className="h-6 w-6 text-red-500" />
                ) : (
                  <BellAlertIcon className="h-6 w-6" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <p className="font-bold text-base uppercase tracking-tight">{alert.type}</p>
                  <span className="text-[10px] font-black uppercase opacity-60">
                    {alert.severity} Priority
                  </span>
                </div>
                <p className="text-sm opacity-90 leading-tight mt-0.5">{alert.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AlertSection;