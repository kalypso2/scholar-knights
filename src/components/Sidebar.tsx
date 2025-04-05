import React from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  PlusCircle,
  CalendarDays,
  Search,
  BookOpen,
  ArrowLeftToLine,
  ArrowRightToLine,
  LucideIcon,
} from "lucide-react";

interface NavItem {
  name: string;
  path: string;
  icon: LucideIcon;
}

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const navItems: NavItem[] = [
  { name: "Home", path: "/", icon: Home },
  { name: "Create a Session", path: "/create-session", icon: PlusCircle },
  { name: "View Your Sessions", path: "/your-sessions", icon: CalendarDays },
  { name: "Find a Session", path: "/find-session", icon: Search },
  { name: "Subjects/Courses", path: "/courses", icon: BookOpen },
];

const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
  return (
    <div
      className={`h-screen bg-gray-200 p-4 fixed top-0 left-0 shadow-lg border-r border-gray-300 transition-all duration-300 z-10 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-5 top-6 bg-gray-300 p-1 rounded-full shadow-md hover:bg-gray-400 transition"
        type="button"
      >
        {collapsed ? (
          <ArrowRightToLine size={20} />
        ) : (
          <ArrowLeftToLine size={20} />
        )}
      </button>

      {/* Logo / Title */}
      <div
        className={`bg-gradient-to-r from-blue-500 to-purple-500 text-white text-center py-3 rounded-lg font-bold transition-all duration-300 ${
          collapsed ? "text-sm" : "text-lg"
        }`}
      >
        {collapsed ? "SK" : "Scholar Knights"}
      </div>

      {/* Navigation Links */}
      <nav className="space-y-3 mt-4">
        {navItems.map(({ name, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }: { isActive: boolean }) =>
              `flex items-center gap-3 p-3 rounded transition duration-300 ${
                isActive
                  ? "bg-gray-300 text-black font-medium"
                  : "hover:bg-gray-200"
              } ${collapsed ? "justify-center" : ""}`
            }
          >
            <Icon size={20} className="transition-all duration-300" />
            {!collapsed && <span className="text-sm">{name}</span>}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
