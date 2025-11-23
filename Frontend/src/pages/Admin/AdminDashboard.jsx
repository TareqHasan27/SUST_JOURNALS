import React, { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import Overview from "./components/Overview";
import PendingList from "./components/PendingList";
import ReviewedList from "./components/ReviewedList";
import PaperDetail from "./components/PaperDetail";

import { getData } from "@/components/userContext";
import axios from "axios";

const AdminDashboard = () => {
  const [currentView, setCurrentView] = useState("overview");
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [papers, setPapers] = useState([]);
  const [reviewAction, setReviewAction] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const { user } = getData();
  useEffect(() => {
    if (!user) return;
    const fetchPapers = async () => {
      try {
        const adminId = user.reg_no;
        const res = await axios.get(
          `http://localhost:4000/api/admin/${adminId}`
        );
        setPapers(res.data.papers);
        console.log("from fron", papers);
      } catch (error) {
        if (error.response) {
          // server responded with a status (404, 500, etc)
          console.error(
            "Axios error response:",
            error.response.status,
            error.response.data
          );
        } else if (error.request) {
          // request made but no response
          console.error("No response received:", error.request);
        } else {
          console.error("Axios setup error:", error.message);
        }
      }
    };
    fetchPapers();
  }, [user]);

  console.log("papers", papers);

  // Categorize papers
  const pendingPapers = papers.filter((p) => p.status === "pending");
  const acceptedPapers = papers.filter((p) => p.status === "accepted");
  const rejectedPapers = papers.filter((p) => p.status === "rejected");

  const handleViewPaper = (paper) => {
    setSelectedPaper(paper);
    setCurrentView("detail");
  };

  const handleSubmitReview = async (paper) => {
    try {
      console.log(paper);
      const res = await axios.post(
        "http://localhost:4000/api/admin/addreview",
        {
          reg_no: paper.created_by,
          paper_id: paper.id,
          submitted_to: user.reg_no,
          action: reviewAction,
          comment: reviewComment,
        }
      );

      console.log("submited successfully", res);
    } catch (error) {
      console.log("error occured", error);
    }
    setCurrentView("overview");
    setSelectedPaper(null);
    setReviewAction("");
    setReviewComment("");
  };

  return (
    <div className="admin-dashboard-container flex gap-6 p-6 bg-green-50 pt-12 mt-5">
      <Sidebar setCurrentView={setCurrentView} className="flex-1" />
      <div className="dashboard-content flex-1">
        {currentView === "overview" && (
          <Overview
            pending={pendingPapers.length}
            accepted={acceptedPapers.length}
            rejected={rejectedPapers.length}
            recent={papers.slice(0, 3)}
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
