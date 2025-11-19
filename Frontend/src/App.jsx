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
