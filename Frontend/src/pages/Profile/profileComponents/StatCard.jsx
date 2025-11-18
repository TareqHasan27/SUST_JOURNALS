import React from "react";

const StatCard = ({ label, icon: Icon ,value, color }) => (
  console.log("ICON FROM STATCARD:", Icon),

  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 flex justify-between items-center space-x-0.5">
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-black">{value}</p>
    </div>
    <div className={`p-2 rounded-lg ${color}`}>
      {Icon && <Icon className="text-white" size={16} />}
    </div>
  </div>
);

export default StatCard;
