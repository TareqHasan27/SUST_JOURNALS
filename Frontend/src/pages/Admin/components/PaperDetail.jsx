import React from "react";
import {
  ArrowLeft,
  User,
  Mail,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Send,
} from "lucide-react";
import AdminPDFViewer from "../../Common/AdminPDFViewer";

const PaperDetail = ({
  paper,
  reviewAction,
  reviewComment,
  setReviewAction,
  setReviewComment,
  handleSubmitReview,
  goBack,
}) => (
  <div>
    <button
      onClick={goBack}
      className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
    >
      <ArrowLeft className="w-4 h-4" />
      Back to Dashboard
    </button>
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      {/* Header */}
      <div className="border-b border-gray-200 pb-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-3xl font-bold text-gray-900 flex-1">
            {paper.title}
          </h2>
          <span
            className={`px-4 py-2 rounded-full text-sm font-medium ${
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

        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span>
              <strong>Author:</strong> {paper.author}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            <span>
              <strong>Email:</strong> {paper.email}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>
              <strong>Submitted:</strong> {paper.submissionDate}
            </span>
          </div>
        </div>
      </div>

      {/* Abstract */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-3">Abstract</h3>
        <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
          {paper.abstract}
        </p>
      </div>

      {/* Keywords */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-3">Keywords</h3>
        <div className="flex flex-wrap gap-2">
          {paper.keywords?.map((keyword, idx) => (
            <span
              key={idx}
              className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
            >
              {keyword}
            </span>
          ))}
        </div>
      </div>

      {/* PDF Viewer */}
      <AdminPDFViewer pdfUrl={paper.pdfUrl} />

      {/* Review Section */}
      {paper.status === "pending" && (
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Review Decision
          </h3>

          <div className="mb-4 flex gap-3">
            <button
              onClick={() => setReviewAction("accepted")}
              className={`flex-1 px-4 py-3 rounded-lg border-2 ${
                reviewAction === "accepted"
                  ? "border-green-500 bg-green-50 text-green-700"
                  : "border-gray-300 hover:border-green-300"
              }`}
            >
              <CheckCircle className="w-5 h-5 mx-auto mb-1" />
              Accept & Publish
            </button>

            <button
              onClick={() => setReviewAction("revise")}
              className={`flex-1 px-4 py-3 rounded-lg border-2 ${
                reviewAction === "revise"
                  ? "border-yellow-500 bg-yellow-50 text-yellow-700"
                  : "border-gray-300 hover:border-yellow-300"
              }`}
            >
              <Clock className="w-5 h-5 mx-auto mb-1" />
              Request Revision
            </button>

            <button
              onClick={() => setReviewAction("rejected")}
              className={`flex-1 px-4 py-3 rounded-lg border-2 ${
                reviewAction === "rejected"
                  ? "border-red-500 bg-red-50 text-red-700"
                  : "border-gray-300 hover:border-red-300"
              }`}
            >
              <XCircle className="w-5 h-5 mx-auto mb-1" />
              Reject
            </button>
          </div>

          {/* Feedback Input */}
          <textarea
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
            rows="6"
            className="w-full px-4 py-3 border border-gray-500 rounded-lg focus:ring-blue-500"
            placeholder="Write your review..."
          />

          <button
            onClick={() => handleSubmitReview(paper)}
            disabled={!reviewAction || !reviewComment.trim()}
            className="w-full bg-green-500 text-white px-6 py-3 rounded-lg font-medium mt-4 hover:bg-green-700 disabled:bg-gray-300"
          >
            <Send className="w-5 h-5 inline-block mr-2" />
            Submit Review
          </button>
        </div>
      )}
    </div>
  </div>
);

export default PaperDetail;
