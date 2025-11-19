import React from "react";
import PaperCard from "./PaperCard";

const ReviewedList = ({ acceptedPapers, rejectedPapers, handleViewPaper }) => {
  const total = acceptedPapers.length + rejectedPapers.length;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Reviewed Papers ({total})
      </h2>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-green-800 mb-3">
          Accepted ({acceptedPapers.length})
        </h3>
        <div className="space-y-3 mb-6">
          {acceptedPapers.map((paper) => (
            <PaperCard key={paper.id} paper={paper} onClick={() => handleViewPaper(paper)} />
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-red-800 mb-3">
          Rejected ({rejectedPapers.length})
        </h3>
        <div className="space-y-3">
          {rejectedPapers.map((paper) => (
            <PaperCard key={paper.id} paper={paper} onClick={() => handleViewPaper(paper)} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewedList;
