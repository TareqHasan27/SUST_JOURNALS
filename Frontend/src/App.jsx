import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Hero from "./components/Hero";
import AppLayout from "./layouts/AppLayout";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyOTP from "./pages/VerifyOTP";
import ChangePassword from "./pages/ChangePassword";
import VerifyOtpFromSignup from "./pages/VerifyOtpFromSignup";
import AuthorRankingSystem from "./pages/ranking/AuthorCard";
import BookmarkSection from "./pages/bookmarks/BookMarks";
import PaperSubmissionForm from "./pages/submitpaper/SubmitPaper";
import ChatbotButton from "./pages/chatbot/ChatbotButton";
import ChatbotPage from "./pages/chatbot/ChatbotPage";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import ResearchPaperDisplay from "./pages/Article/ResearchPaperDisplay";
import UserProfile from "./pages/Profile/UserProfile";
import HomeSection from "./pages/Home/HomePage";
import Notification from "./pages/Notifications/Notification";
import ProtectedRoute from "./components/ProtectedRoute";
const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <Hero />,
      },
      {
        path: "/ranking",
        element: (
          <ProtectedRoute>
            <AuthorRankingSystem></AuthorRankingSystem>
          </ProtectedRoute>
        ),
      },
      {
        path: "/bookmarks",
        element: (
          <ProtectedRoute>
            <BookmarkSection></BookmarkSection>
          </ProtectedRoute>
        ),
      },
      {
        path: "/submit-paper",
        element: (
          <ProtectedRoute>
            <PaperSubmissionForm></PaperSubmissionForm>
            <ChatbotButton></ChatbotButton>
          </ProtectedRoute>
        ),
      },
      {
        path: "/overview/:id",
        element: (
          <ProtectedRoute>
            <ChatbotPage></ChatbotPage>
          </ProtectedRoute>
        ),
      },
      {
        path: "/chat-bot",
        element: (
          <ProtectedRoute>
            <ChatbotPage></ChatbotPage>
          </ProtectedRoute>
        ),
      },
      {
        path: "/paper/:paperId",
        element: (
          <ProtectedRoute>
            <ResearchPaperDisplay></ResearchPaperDisplay>
          </ProtectedRoute>
        ),
      },
      {
        path: "/profile/:reg_no",
        element: (
          <ProtectedRoute>
            <UserProfile></UserProfile>
          </ProtectedRoute>
        ),
      },
      {
        path: "/publications",
        element: (
          <ProtectedRoute>
            <HomeSection></HomeSection>
          </ProtectedRoute>
        ),
      },
      {
        path: "/notifications",
        element: <Notification></Notification>,
      },
    ],
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/verify/change-password",
    element: <VerifyOTP />,
  },
  {
    path: "/verify/signup",
    element: <VerifyOtpFromSignup />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/change-password/:email",
    element: <ChangePassword />,
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <AdminDashboard></AdminDashboard>
      </ProtectedRoute>
    ),
  },
]);
const App = () => {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
