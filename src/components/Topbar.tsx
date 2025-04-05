import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, LogIn, UserPlus, LogOut } from "lucide-react";

const Topbar: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = (): void => {
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    navigate("/");
  };

  return (
    <div className="flex items-center justify-between bg-gray-200 p-3 rounded-lg mb-6 w-full">
      {/* Spacer */}
      <div className="w-1/3" />

      {/* Centered Search Bar with Clickable Right Icon Inside */}
      <div className="relative w-1/3">
        <input
          type="text"
          placeholder="Search"
          className="bg-gray-100 w-full p-2 pr-10 rounded border border-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
        <button
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-purple-500 transition"
          type="button"
        >
          <Search size={20} />
        </button>
      </div>

      {/* Auth Buttons */}
      <div className="flex items-center justify-end gap-4 w-1/3">
        {isAuthenticated ? (
          <button
            onClick={handleLogout}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90 transition"
          >
            <LogOut size={18} /> Logout
          </button>
        ) : (
          <>
            <Link to="/LoginPage">
              <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90 transition">
                <LogIn size={18} /> Login
              </button>
            </Link>
            <Link to="/SignupPage">
              <button className="bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90 transition">
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
