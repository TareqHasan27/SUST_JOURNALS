import { Clock, FileText } from "lucide-react";

const NotificationCard = ({ notification, onClick }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div
      className="border rounded-lg p-5 transition-all duration-300 hover:shadow-lg cursor-pointer bg-white border-gray-200"
      onClick={() => onClick(notification.paperId)}
    >
      <div className="flex gap-4">
        {/* Icon */}
        <div className="shrink-0">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-green-100">
            <FileText className="w-6 h-6 text-green-600" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold mb-1 line-clamp-1 text-green-800">
            {notification.paperTitle}
          </h3>

          <p className="text-sm text-gray-700 mb-3 line-clamp-2">
            {notification.message}
          </p>

          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <span className="font-medium text-green-600">From:</span>{" "}
              {notification.adminName}
            </span>
            <span className="text-gray-300">•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatDate(notification.timestamp)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;
