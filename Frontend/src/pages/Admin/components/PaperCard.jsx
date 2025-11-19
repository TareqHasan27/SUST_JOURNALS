import React from "react";
import { User, Calendar, Mail } from "lucide-react";

const PaperCard = ({ paper, onClick }) => (
  <div
    onClick={onClick}
    className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
  >
    <div className="flex items-start justify-between mb-3">
      <h3 className="text-lg font-semibold text-gray-900 flex-1 pr-4">
        {paper.title}
      </h3>
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
          paper.status === "pending"
            ? "bg-yellow-100 text-yellow-800"
            : paper.status === "accepted"
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800"
        }`}
      >
        {paper.status.charAt(0).toUpperCase() + paper.status.slice(1)}
      </span>
    </div>

    <div className="space-y-2 text-sm text-gray-600">
      <div className="flex items-center gap-2">
        <User className="w-4 h-4" />
        <span>{paper.author}</span>
      </div>
      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4" />
        <span>Submitted: {paper.submissionDate}</span>
      </div>
      <div className="flex items-center gap-2">
        <Mail className="w-4 h-4" />
        <span>{paper.email}</span>
      </div>
    </div>

    <div className="mt-3 flex flex-wrap gap-2">
      {paper.keywords.slice(0, 3).map((keyword, idx) => (
        <span
          key={idx}
          className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
        >
          {keyword}
        </span>
      ))}
    </div>
  </div>
);

export default PaperCard;
