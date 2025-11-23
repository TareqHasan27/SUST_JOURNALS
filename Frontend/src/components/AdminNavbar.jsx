import {
  BookA,
  Target,
  LogOut,
  User,
  Home,
  Briefcase,
  GraduationCap,
  FolderOpen,
  Menu,
  X,
  ShieldHalf,
  Send,
  BookmarkCheck,
  Bell,
  Award,
} from "lucide-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { toast } from "sonner";
import { getData } from "./userContext";

const AdminNavbar = () => {
  const { user, setUser, loading } = getData();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin border-green-600" />
      </div>
    );
  }
  const logoutHandler = async () => {
    setUser(null);
    toast.success(res.data.message);
    localStorage.clear();
    navigate("/");
  };

  return (
    <nav className="p-3 border-b border-gray-200 bg-transparent relative z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex gap-2 items-center">
          <GraduationCap className="h-6 w-6 text-green-800" />
          <h1 className="font-bold text-xl">
            <span className="text-green-600">SUST</span>JOURNALS
          </h1>
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-7 items-center text-lg font-semibold text-green-800">
          {/* User Dropdown */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar className="cursor-pointer">
                  <AvatarImage src={user?.profile_url} />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={logoutHandler}
                  className="flex items-center gap-2 text-red-600"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <li>
              <Link to="/login" className="hover:text-green-600">
                Login
              </Link>
            </li>
          )}
        </ul>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-green-800"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Overlapping Mobile Menu */}
      <div
        className={`fixed top-[60px] left-0 w-full bg-green-50/95 backdrop-blur-md shadow-lg transition-all duration-300 ease-in-out md:hidden ${
          menuOpen
            ? "opacity-100 translate-y-0 visible"
            : "opacity-0 -translate-y-5 invisible"
        }`}
      >
        <ul className="flex flex-col gap-4 p-5 text-green-800 font-medium">
          {user ? (
            <>
              <LogOut className="w-4 h-4" /> Logout
            </>
          ) : (
            <li>
              <Link to="/login" onClick={() => setMenuOpen(false)}>
                Login
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default AdminNavbar;
