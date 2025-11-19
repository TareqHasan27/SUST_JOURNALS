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
<<<<<<< HEAD
import ChatbotButton from "./pages/chatbot/ChatbotButton";
import ChatbotPage from "./pages/chatbot/ChatbotPage";
=======
import AdminDashboard from "./pages/Admin/AdminDashboard";
import ResearchPaperDisplay from "./pages/Article/ResearchPaperDisplay";
>>>>>>> cfcc26f45e34d2a2d8c7a743959eecdbcf54c049
const router = createBrowserRouter([
  {
    element: <AppLayout />, 
    children: [
      {
       path: '/',
       element:<Hero/>
    }
    ]
  },
    {
        path: '/signup',
        element: <Signup/>
      },
      {
        path: '/verify/change-password',
        element: <VerifyOTP/>
      },
      {
        path: '/verify/signup',
        element: <VerifyOtpFromSignup/>
      },
      {
        path: '/login',
        element: <Login />
      },
      {
        path: '/forgot-password',
        element: <ForgotPassword />
      },
      {
        path: '/change-password/:email',
        element: <ChangePassword />
      },{
        path:'/ranking',
        element:<AuthorRankingSystem></AuthorRankingSystem>
      },
      {
        path:'/bookmarks',
        element:<BookmarkSection></BookmarkSection>
      },
      {
        path:'/submit-paper',
        element:<PaperSubmissionForm></PaperSubmissionForm>
      },
      {
<<<<<<< HEAD
        path:'/overview/:id',
        element:<ChatbotPage></ChatbotPage>
=======
        path:'/admin',
        element:<AdminDashboard></AdminDashboard>
      },
      {
        path:'/article',
        element:<ResearchPaperDisplay></ResearchPaperDisplay>
>>>>>>> cfcc26f45e34d2a2d8c7a743959eecdbcf54c049
      }
]);
const App = () => {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
