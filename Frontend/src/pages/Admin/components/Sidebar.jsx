import React from "react";
import { Eye, Clock, CheckCircle } from "lucide-react";

const Sidebar = ({ currentView, setCurrentView, pendingCount, reviewedCount }) => (
  <aside className="w-64 shrink-0">
    <nav className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sticky top-6">
      <h2 className="text-3xl font-bold text-green-500 uppercase tracking-wide mb-4">
        Admin <span className="text-gray-800 text-sm font-extrabold">Dashboard</span>
      </h2>
      
      <div className="space-y-2">
        <button
          onClick={() => setCurrentView("overview")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            currentView === "overview"
              ? "bg-blue-50 text-blue-700 font-medium"
              : "text-gray-800 hover:bg-green-500"
          }`}
        >
          <Eye className="w-5 h-5" />
          <span>Overview</span>
        </button>

        <button
          onClick={() => setCurrentView("pending")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            currentView === "pending"
              ? "bg-blue-50 text-blue-700 font-medium"
              : "text-gray-700 hover:bg-green-500"
          }`}
        >
          <Clock className="w-5 h-5" />
          <div className="flex-1 text-left">
            <span>Pending Review</span>
            {pendingCount > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                {pendingCount}
              </span>
            )}
          </div>
        </button>

        <button
          onClick={() => setCurrentView("reviewed")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            currentView === "reviewed"
              ? "bg-blue-50 text-blue-700 font-medium"
              : "text-gray-700 hover:bg-green-500"
          }`}
        >
          <CheckCircle className="w-5 h-5" />
          <div className="flex-1 text-left">
            <span>Reviewed Papers</span>
            <span className="ml-2 px-2 py-0.5 bg-blue-100 text-gray-700 rounded-full text-xs font-medium">
              {reviewedCount}
            </span>
          </div>
        </button>
      </div>
    </nav>
  </aside>
);

export default Sidebar;
