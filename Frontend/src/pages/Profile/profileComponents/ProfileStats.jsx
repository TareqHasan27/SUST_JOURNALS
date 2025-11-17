import React from "react";
import { Award, TrendingUp } from "lucide-react";
import StatCard from "./StatCard";

const ProfileStats = ({ stats }) => {

  console.log("Award icon is:", Award);
  console.log("TrendingUp icon is:", TrendingUp);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">


      <StatCard label="Citations" value={stats.citations} icon={Award} color="bg-green-500" />
      <StatCard label="h-index" value={stats.hIndex} icon={TrendingUp} color="bg-purple-500" />
      <StatCard label="i10-index" value={stats.i10Index} icon={TrendingUp} color="bg-orange-500" />
    </div>
  );
};

export default ProfileStats;
