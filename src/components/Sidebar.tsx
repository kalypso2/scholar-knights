//import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-64 bg-gray-200 p-4 space-y-4">
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-center py-3 rounded-lg font-bold">
        Logo
      </div>
      <nav className="space-y-2">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `block p-2 hover:bg-gray-300 rounded ${
              isActive ? "bg-gray-400" : ""
            }`
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/create-session"
          className={({ isActive }) =>
            `block p-2 hover:bg-gray-300 rounded ${
              isActive ? "bg-gray-400" : ""
            }`
          }
        >
          Create a session
        </NavLink>
        <NavLink
          to="/your-sessions"
          className={({ isActive }) =>
            `block p-2 hover:bg-gray-300 rounded ${
              isActive ? "bg-gray-400" : ""
            }`
          }
        >
          View your sessions
        </NavLink>
        <NavLink
          to="/find-session"
          className={({ isActive }) =>
            `block p-2 hover:bg-gray-300 rounded ${
              isActive ? "bg-gray-400" : ""
            }`
          }
        >
          Find a session
        </NavLink>
        <NavLink
          to="/courses"
          className={({ isActive }) =>
            `block p-2 hover:bg-gray-300 rounded ${
              isActive ? "bg-gray-400" : ""
            }`
          }
        >
          Subjects/Courses
        </NavLink>
        <NavLink
          to="/LoginPage"
          className={({ isActive }) =>
            `block p-2 hover:bg-gray-300 rounded ${
              isActive ? "bg-gray-400" : ""
            }`
          }
        >
          Login/Logout
        </NavLink>
        <NavLink
          to="/SignupPage"
          className={({ isActive }) =>
            `block p-2 hover:bg-gray-300 rounded ${
              isActive ? "bg-gray-400" : ""
            }`
          }
        >
          SignUp
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
