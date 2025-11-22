import React, { useState } from "react";
import { Bell } from "lucide-react";
import NotificationCard from "./NotificationCard";

const mockNotifications = [
  {
    id: 1,
    paperId: 101,
    paperTitle: "MCP-1: Function, regulation, and involvement in disease",
    message: "Your paper has been approved and is now published in the repository!",
    adminName: "Dr. Sarah Johnson",
    timestamp: "2024-11-20T10:30:00",
    isRead: false,
    type: "approval"
  },
  {
    id: 2,
    paperId: 102,
    paperTitle: "Incense smoke (IS) inhalation exposure system: Physicochemical characterization",
    message: "Your paper has received 5 new citations this week. Great work!",
    adminName: "System Admin",
    timestamp: "2024-11-19T14:45:00",
    isRead: false,
    type: "citation"
  },
  {
    id: 3,
    paperId: 103,
    paperTitle: "Advanced particle dosimetry in respiratory toxicology",
    message: "Please update the abstract section of your paper as per reviewer comments.",
    adminName: "Dr. Michael Chen",
    timestamp: "2024-11-18T09:15:00",
    isRead: true,
    type: "revision"
  },
  {
    id: 4,
    paperId: 104,
    paperTitle: "Nanotoxicology: Health effects of engineered nanomaterials",
    message: "Congratulations! Your paper has been featured in this month's top research highlights.",
    adminName: "Editorial Team",
    timestamp: "2024-11-17T16:20:00",
    isRead: true,
    type: "feature"
  },
  {
    id: 5,
    paperId: 105,
    paperTitle: "Environmental impact of airborne particulate matter",
    message: "Your submission is under review. Expected completion date: Nov 30, 2024.",
    adminName: "Dr. Emily White",
    timestamp: "2024-11-15T11:00:00",
    isRead: false,
    type: "review"
  }
];

const Notifications = () => {
  const [notifications, setNotifications] = useState(mockNotifications);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleNotificationClick = (notification) => {
    // Mark notification as read when clicked
    setNotifications(notifications.map(n => 
      n.id === notification.id ? { ...n, isRead: true } : n
    ));
    
    // Navigate to paper view
    console.log("Navigate to paper:", notification.paperId);
    // Add navigation logic here, e.g.:
    // window.location.href = `/paper/${notification.paperId}`;
    // or with React Router:
    // navigate(`/paper/${notification.paperId}`);
  };

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
              <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
              <p className="text-sm text-gray-600">
                {unreadCount > 0 
                  ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` 
                  : 'All caught up!'}
              </p>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onClick={handleNotificationClick}
              />
            ))
          ) : (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No notifications</h3>
              <p className="text-gray-600">You're all caught up!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;