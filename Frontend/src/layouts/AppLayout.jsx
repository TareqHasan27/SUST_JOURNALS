import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import ChatbotButton from "@/pages/chatbot/ChatbotButton";

const AppLayout = () => {
  return (
    <>
      <Navbar></Navbar>
      <Outlet />
    </>
  );
};

export default AppLayout;
