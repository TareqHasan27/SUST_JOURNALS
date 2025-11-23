import { Navigate } from "react-router-dom";
import { getData } from "./userContext";
import ChatbotButton from "@/pages/chatbot/ChatbotButton";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = getData();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin border-green-600" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (user.role !== "student") {
    return <Navigate to={`/admin`} replace />;
  }

  return (
    <>
      {children}
      <ChatbotButton />
    </>
  );
};

export default ProtectedRoute;
