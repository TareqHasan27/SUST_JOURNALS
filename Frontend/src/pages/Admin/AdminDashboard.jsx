import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Overview from "./components/Overview";
import PendingList from "./components/PendingList";
import ReviewedList from "./components/ReviewedList";
import PaperDetail from "./components/PaperDetail";

import mockPapers from "./mockPapers";

const AdminDashboard = () => {

  const [currentView, setCurrentView] = useState("overview");
  const [selectedPaper, setSelectedPaper] = useState(null);

  const [reviewAction, setReviewAction] = useState("");
  const [reviewComment, setReviewComment] = useState("");

  // Categorize papers
  const pendingPapers = mockPapers.filter(p => p.status === "pending");
  const acceptedPapers = mockPapers.filter(p => p.status === "accepted");
  const rejectedPapers = mockPapers.filter(p => p.status === "rejected");


  const handleViewPaper = (paper) => {
    setSelectedPaper(paper);
    setCurrentView("detail");
  };

  const handleSubmitReview = () => {
    console.log("Review submitted:", reviewAction, reviewComment);

    // After reviewing, go back to overview
    setCurrentView("overview");
    setSelectedPaper(null);
    setReviewAction("");
    setReviewComment("");
  };

  return (
    <div className="admin-dashboard-container flex gap-6 p-15 bg-green-50 pt-12 mt-5">

      <Sidebar setCurrentView={setCurrentView} className="flex-1" />

      <div className="dashboard-content flex-1">
        {currentView === "overview" && (
          <Overview
            pending={pendingPapers.length}
            accepted={acceptedPapers.length}
            rejected={rejectedPapers.length}
            recent={mockPapers.slice(0, 3)}
            goPending={() => setCurrentView("pending")}
            goReviewed={() => setCurrentView("reviewed")}
            handleViewPaper={handleViewPaper}
          />
        )}

        {currentView === "pending" && (
          <PendingList
            pendingPapers={pendingPapers}
            handleViewPaper={handleViewPaper}
          />
        )}

        {currentView === "reviewed" && (
          <ReviewedList
            acceptedPapers={acceptedPapers}
            rejectedPapers={rejectedPapers}
            handleViewPaper={handleViewPaper}
          />
        )}

        {currentView === "detail" && selectedPaper && (
          <PaperDetail
            paper={selectedPaper}
            reviewAction={reviewAction}
            reviewComment={reviewComment}
            setReviewAction={setReviewAction}
            setReviewComment={setReviewComment}
            handleSubmitReview={handleSubmitReview}
            goBack={() => setCurrentView("overview")}
          />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
