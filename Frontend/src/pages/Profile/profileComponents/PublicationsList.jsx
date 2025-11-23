import React from "react";
import { BookOpen, Mail, Eye, Download, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PublicationsList = ({ publications }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  const navigate = useNavigate();

  const handleViewPaper = (paperId) => {
    navigate(`/paper/${paperId}`);
  };

  const handleAiOverview = (paperId) => {
    navigate(`/overview/${paperId}`);
  };

  return (
    <div className="bg-white shadow-md rounded-xl p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        Publications ({publications.length})
      </h2>

      <div className="space-y-4">
        {publications.map((paper) => (
          <div
            key={paper.id}
            className="border border-green-200 rounded-lg p-6 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex flex-col md:flex-row gap-4">
              {/* Left side - Paper icon */}
              <div className="shrink-0">
                <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-8 h-8 text-green-600" />
                </div>
              </div>

              {/* Middle - Paper details */}
              <div className="flex-1 min-w-0">
                <h3
                  className="text-lg font-bold text-gray-900 mb-2 hover:text-green-700 cursor-pointer line-clamp-2"
                  onClick={() => handleViewPaper(paper.id)}
                >
                  {paper.title}
                </h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {paper.abstract}
                </p>
                <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-3">
                  <span className="font-medium">👤 {paper.authors}</span>
                  <span className="text-gray-400">•</span>
                  <span className="bg-green-50 text-green-700 px-2 py-1 rounded">
                    {paper.department}
                  </span>
                </div>
                <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    <span>Published: {formatDate(paper.publicationDate)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Download className="w-3 h-3" />
                    <span>{paper.downloadCount} downloads</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-3 h-3" />
                    <span>{paper.citedBy} citations</span>
                  </div>
                </div>
                {paper.bookmarkedAt && (
                  <div className="mt-2 text-xs text-gray-400">
                    Bookmarked on {formatDate(paper.bookmarkedAt)}
                  </div>
                )}
              </div>

              {/* Right side - Actions */}
              <div className="flex md:flex-col gap-2 shrink-0">
                <button
                  onClick={() => handleAiOverview(paper.id)}
                  className="px-3 py-2 border border-purple-300 text-purple-600 hover:bg-purple-50 rounded-lg text-sm flex items-center gap-1 transition-colors"
                >
                  <span className="text-base">✨</span>
                  AI Overview
                </button>
                <button
                  onClick={() => handleViewPaper(paper.id)}
                  className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm flex items-center gap-2 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  View Paper
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PublicationsList;
