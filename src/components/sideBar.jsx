// src/components/Sidebar.jsx
import React, { useState } from "react";
import {
  HomeIcon,
  HeartIcon,
  FireIcon,
  ShieldCheckIcon,
  BeakerIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

const Sidebar = ({ activeTab, setActiveTab }) => {
  // Navigation items mapped to your specific sensors/features
  const menuItems = [
    { id: "Home", name: "Overview", icon: <HomeIcon className="h-5 w-5" /> },
    { id: "Fitness", name: "Fitness (Steps)", icon: <FireIcon className="h-5 w-5" /> },
    { id: "Wellness", name: "Vitals (Heart/SpO₂)", icon: <HeartIcon className="h-5 w-5" /> },
    { id: "Stress", name: "Stress (GSR)", icon: <BeakerIcon className="h-5 w-5" /> },
    { id: "Safety", name: "Safety (Fall)", icon: <ShieldCheckIcon className="h-5 w-5" /> },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen hidden md:flex flex-col sticky top-0">
      {/* Brand Header */}
      <div className="p-6">
        <h2 className="text-2xl font-bold text-green-600 flex items-center gap-2">
          <div className="bg-green-600 p-1.5 rounded-lg">
             <HeartIcon className="h-6 w-6 text-white" />
          </div>
          <span>HealthSync</span>
        </h2>
        <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-semibold">
          IoT Wellness System
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex items-center gap-3 p-3 rounded-xl w-full text-left transition-all duration-200
              ${activeTab === item.id 
                ? "bg-green-50 text-green-700 shadow-sm font-bold" 
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"}`}
          >
            {item.icon}
            {item.name}
          </button>
        ))}
      </nav>

      {/* Settings & User at Bottom */}
      <div className="p-4 border-t border-gray-100">
        <button 
          onClick={() => setActiveTab("Settings")}
          className="flex items-center gap-3 p-3 rounded-xl w-full text-gray-500 hover:bg-gray-50 transition-all"
        >
          <Cog6ToothIcon className="h-5 w-5" />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;