import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn, UserPlus, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Topbar: React.FC = () => {
  const { isAuthenticated, userName, logout } = useAuth();
  const navigate = useNavigate();

  const firstInitial = userName ? userName.charAt(0).toUpperCase() : "";

  const handleLogout = (): void => {
    logout();
    navigate("/");
  };

  const goToProfile = () => {
    navigate("/ProfilePage");
  };

  return (
    <div className="flex items-center justify-between bg-gray-200 p-3 rounded-lg mb-6 w-full">
      {/* Spacer */}
      <div className="w-1/3" />

      {/* Logo / Title */}
      <div className="relative w-1/6">
        <div className="text-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white text-center py-3 rounded-lg font-bold transition-all duration-300">
          Scholar Knights
        </div>
      </div>

      {/* Auth Buttons */}
      <div className="flex items-center justify-end gap-4 w-1/3">
        {isAuthenticated ? (
          <>
            <span className="text-gray-700 font-semibold">
              Hello, {userName}
            </span>

            {/* Profile Initial Icon */}
            <button
              onClick={goToProfile}
              className="bg-purple-500 text-white rounded-full w-9 h-9 flex items-center justify-center font-bold hover:opacity-90 hover:scale-105 transition transform cursor-pointer"
              title="Go to Profile"
            >
              {firstInitial}
            </button>

            <button
              onClick={handleLogout}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90 hover:scale-105 transition transform cursor-pointer"
            >
              <LogOut size={18} /> Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/LoginPage">
              <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90 hover:scale-105 transition transform cursor-pointer">
                <LogIn size={18} /> Login
              </button>
            </Link>
            <Link to="/SignupPage">
              <button className="bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90 hover:scale-105 transition transform cursor-pointer">
                <UserPlus size={18} /> Signup
              </button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Topbar;
