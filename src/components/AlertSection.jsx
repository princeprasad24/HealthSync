import React from "react";
import { 
  Bell, 
  BellOff, 
  AlertTriangle, 
  ShieldCheck, 
  Cloud 
} from "lucide-react";

const AlertSection = ({ alerts = [], isNotificationEnabled }) => {
  
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
    <div className="bg-white shadow-sm border border-gray-100 rounded-2xl p-6">
      {/* Header with Connection Status */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Health Alerts</h2>
          <div className="flex items-center gap-2 mt-1">
            <Cloud className="h-4 w-4 text-green-500" />
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              Firebase Real-time Connected
            </span>
          </div>
        </div>
        
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${
          isNotificationEnabled 
            ? "bg-green-50 border-green-100 text-green-700" 
            : "bg-gray-50 border-gray-100 text-gray-400"
        }`}>
          {isNotificationEnabled ? <Bell size={16} /> : <BellOff size={16} />}
          <span className="text-xs font-bold uppercase">
            {isNotificationEnabled ? "Alerts Active" : "Alerts Muted"}
          </span>
        </div>
      </div>

      {/* Alerts List */}
      {alerts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
          <div className="bg-green-100 p-3 rounded-full mb-3">
            <ShieldCheck className="h-8 w-8 text-green-500" />
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
                  <AlertTriangle className="h-6 w-6 text-red-500" />
                ) : (
                  <Bell className="h-6 w-6" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <p className="font-bold text-base uppercase tracking-tight">{alert.type}</p>
                  <span className="text-[10px] font-black uppercase opacity-60">
                    {alert.severity} Priority
                  </span>
                </div>
                <p className="text-sm opacity-90 leading-tight mt-0.5">
                  {alert.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer Info */}
      <div className="mt-6 pt-4 border-t border-gray-50">
        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest text-center">
          Automatic Fall Detection & Vital Monitoring System
        </p>
      </div>
    </div>
  );
};

export default AlertSection;