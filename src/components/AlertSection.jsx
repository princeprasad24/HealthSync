import React, { useState, useEffect } from "react";
import { database } from "../firebase/firebase";
import { ref, onValue, limitToLast, query, remove } from "firebase/database";
import {
  AlertTriangle,
  ShieldCheck,
  Activity,
  Zap,
  Droplets,
  Thermometer,
  Clock,
  Trash2
} from "lucide-react";

const AlertSection = ({ isNotificationEnabled }) => {
  const [dbAlerts, setDbAlerts] = useState([]);

  useEffect(() => {
    // Queries the last 5 alerts from the official Firebase node
    const alertsRef = query(ref(database, "alerts"), limitToLast(5));

    const unsubscribe = onValue(alertsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        // Convert Firebase object to an array and reverse for newest-first display
        const sortedAlerts = Object.entries(data)
          .map(([id, val]) => ({ id, ...val }))
          .sort((a, b) => b.timestamp - a.timestamp); 
        setDbAlerts(sortedAlerts);
      } else {
        setDbAlerts([]);
      }
    });

    return () => unsubscribe();
  }, []);

  // Helper to clear alert history from Firebase
  const clearAlerts = () => {
    if (window.confirm("Are you sure you want to clear all alert history?")) {
      remove(ref(database, "alerts"))
        .then(() => setDbAlerts([]))
        .catch((err) => console.error("Clear failed:", err));
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "Heart Rate": return <Activity size={18} />;
      case "Oxygen": return <Zap size={18} />;
      case "Temperature": return <Thermometer size={18} />;
      case "Stress": return <Droplets size={18} />;
      case "Emergency": return <AlertTriangle size={18} />;
      default: return <Activity size={18} />;
    }
  };

  const getSeverityStyles = (severity) => {
    return severity === "high" 
      ? "bg-red-500/10 text-red-400 border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]" 
      : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
  };

  return (
    <div className="bg-[#0f172a] shadow-2xl border border-slate-800 rounded-[2.5rem] p-8">
      {/* Header Area */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-xl font-black text-white tracking-tight leading-none">System Alerts</h2>
          <div className="flex items-center gap-2 mt-2">
             <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
             <p className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.2em]">Live Database Feed</p>
          </div>
        </div>
        
        <button 
          onClick={clearAlerts}
          className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
          title="Clear History"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Main Alerts List */}
      {dbAlerts.length === 0 ? (
        <div className="flex flex-col items-center py-12 bg-slate-950/40 rounded-[2rem] border border-dashed border-slate-800/50">
          <ShieldCheck className="h-12 w-12 text-emerald-500/20 mb-3" />
          <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Environment Secure</p>
        </div>
      ) : (
        <div className="space-y-4">
          {dbAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`flex items-start gap-4 p-5 border rounded-[1.5rem] transition-all duration-500 animate-in fade-in slide-in-from-bottom-2 ${getSeverityStyles(alert.severity)}`}
            >
              <div className="mt-1 p-2 bg-black/20 rounded-xl">
                {getIcon(alert.type)}
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <p className="font-black text-[10px] uppercase tracking-wider">{alert.type}</p>
                  <div className="flex items-center gap-1.5 text-slate-500 font-bold">
                    <Clock size={10} />
                    <span className="text-[9px]">
                      {alert.timestamp ? new Date(alert.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Now'}
                    </span>
                  </div>
                </div>
                <p className="text-xs font-semibold leading-relaxed opacity-90">
                  {alert.message}
                </p>
              </div>
            </div>
          ))}
          
          <div className="pt-4 text-center">
             <p className="text-[8px] font-black text-slate-700 uppercase tracking-[0.3em]">
               End of Recent Logs
             </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlertSection;