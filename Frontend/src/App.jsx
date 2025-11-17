import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Hero from "./components/Hero";
import AppLayout from "./layouts/AppLayout";
import Signup from "./pages/Signup";
import VerifyEmail from "./pages/VerifyEmail";
import Verify from "./pages/Verify";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyOTP from "./pages/VerifyOTP";
import ChangePassword from "./pages/ChangePassword";
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
        path: '/verify',
        element: <VerifyEmail />
      },
      {
        path: '/verify/:token',
        element: <Verify />
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
        path: '/verify-otp/:email',
        element: <VerifyOTP />
      },
      {
        path: '/change-password/:email',
        element: <ChangePassword />
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
