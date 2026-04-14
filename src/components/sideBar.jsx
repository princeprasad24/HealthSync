import React from "react";
import {
  HomeIcon,
  HeartIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

const Sidebar = ({ activeTab, setActiveTab }) => {

  const menuItems = [
    { id: "Home", name: "Overview", icon: <HomeIcon className="h-5 w-5" /> },
  ];

  return (

    <aside className="w-64 bg-[#0f172a] border-r border-[#1e293b] min-h-screen hidden md:flex flex-col sticky top-0">

      {/* BRAND */}

      <div className="p-6 border-b border-[#1e293b]">

        <h2 className="text-xl font-bold text-emerald-400 flex items-center gap-2">

          <div className="bg-emerald-500 p-1.5 rounded-lg">
            <HeartIcon className="h-6 w-6 text-white" />
          </div>

          <span>HealthSync</span>

        </h2>

        <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">
          IoT Wellness System
        </p>

      </div>

      {/* NAVIGATION */}

      <nav className="flex-1 px-4 py-6 space-y-2">

        {menuItems.map((item) => (

          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex items-center gap-3 p-3 rounded-lg w-full text-left transition-all duration-200

            ${
              activeTab === item.id
                ? "bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30"
                : "text-slate-400 hover:bg-[#020617] hover:text-slate-200"
            }`}
          >

            {item.icon}

            {item.name}

          </button>

        ))}

        <button
          onClick={() => setActiveTab("Settings")}
          className="flex items-center gap-3 p-3 rounded-lg w-full text-slate-400 hover:bg-[#020617] hover:text-slate-200 transition-all"
        >

          <Cog6ToothIcon className="h-5 w-5" />

          <span>Settings</span>

        </button>

      </nav>

      {/* SETTINGS */}

      <div className="p-4 border-t border-[#1e293b]">

        

      </div>

    </aside>

  );
};

export default Sidebar;