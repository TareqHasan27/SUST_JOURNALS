import React from "react";
import StatCard from "./StatCard";
import PaperCard from "./PaperCard";
import { Clock, CheckCircle, XCircle } from "lucide-react";

const Overview = ({ pending, accepted, rejected, recent, goPending, goReviewed, handleViewPaper }) => (
  <div>
    <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h2>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <StatCard title="Pending Review" count={pending} icon={Clock} color="border-yellow-500" onClick={goPending} />
      <StatCard title="Accepted" count={accepted} icon={CheckCircle} color="border-green-500" onClick={goReviewed} />
      <StatCard title="Rejected" count={rejected} icon={XCircle} color="border-red-500" onClick={goReviewed} />
    </div>

    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Submissions</h3>
      <div className="space-y-3">
        {recent.map((paper) => (
          <PaperCard key={paper.id} paper={paper} onClick={() => handleViewPaper(paper)} />
        ))}
      </div>
    </div>
  </div>
);

export default Overview;
