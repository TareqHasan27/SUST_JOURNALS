import React, { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import NotificationCard from "./NotificationCard";
import { getData } from "@/components/userContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [localloading, setLocalLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user, loading } = getData();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return; // Only fetch after user is available

    const fetchNotifications = async () => {
      try {
        setLocalLoading(true);
        setError(null);

        const res = await axios.post(
          "http://localhost:4000/api/service/notifyuser",
          { reg_no: user.reg_no },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );

        if (
          res.data.status === "success" &&
          Array.isArray(res.data.data) &&
          res.data.data.length > 0
        ) {
          const formatted = res.data.data.map((n) => ({
            id: n.paper_id,
            paperId: n.paper_id,
            paperTitle: n.title,
            message: n.review_message,
            adminName: n.from_admin,
            timestamp: n.date,
            type: n.action,
          }));

          setNotifications(formatted);
        } else {
          setNotifications([]);
        }
      } catch (err) {
        console.error("Error loading notifications:", err);
        setError("Failed to load notifications. Please try again later.");
      } finally {
        setLocalLoading(false);
      }
    };

    fetchNotifications();
  }, [user]); // Only refetch if user changes

  const handleNavigate = (paperId) => {
    navigate(`/paper/${paperId}`);
  };

  if (loading || localloading) {
    return (
      <div className="min-h-screen bg-green-50 px-4 py-10">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading notifications...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-green-50 px-4 py-10">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-xl shadow-md p-12 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-red-900 mb-2">Error</h3>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50 px-4 py-10">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Bell className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Notifications
              </h1>
              <p className="text-sm text-gray-600">
                Showing all your notifications
              </p>
            </div>
          </div>
        </div>

        {/* Notification List */}
        <div className="space-y-3">
          {notifications.length > 0 ? (
            notifications.map((n) => (
              <NotificationCard
                key={n.id}
                notification={n}
                onClick={handleNavigate}
              />
            ))
          ) : (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No notifications
              </h3>
              <p className="text-gray-600">You're all caught up!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
