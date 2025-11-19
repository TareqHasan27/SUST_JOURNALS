import React from "react";
import PaperCard from "./PaperCard";
import { Clock } from "lucide-react";

const PendingList = ({ pendingPapers, handleViewPaper }) => (
  <div>
    <h2 className="text-2xl font-bold text-gray-900 mb-6">
      Pending Review ({pendingPapers.length})
    </h2>

    <div className="space-y-4">
      {pendingPapers.map((paper) => (
        <PaperCard key={paper.id} paper={paper} onClick={() => handleViewPaper(paper)} />
      ))}

      {pendingPapers.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No pending papers to review</p>
        </div>
      )}
    </div>
  </div>
);

export default PendingList;
