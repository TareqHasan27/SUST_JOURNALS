import React from "react";

const StatCard = ({ title, count, icon: Icon, color, onClick }) => (
  <button
    onClick={onClick}
    className={`bg-white p-6 rounded-lg border-l-4 ${color} hover:shadow-lg transition-shadow w-full text-left`}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-600 text-sm font-medium mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-900">{count}</p>
      </div>
      <Icon className="w-12 h-12 text-gray-600" />
    </div>
  </button>
);

export default StatCard;
