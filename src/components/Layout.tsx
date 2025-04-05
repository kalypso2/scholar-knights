import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import FeatureCards from "./FeatureCards";
import { Outlet, useLocation } from "react-router-dom";

const Layout: React.FC = () => {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const location = useLocation();

  const featureCardPaths: string[] = ["/"];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div
        className={`flex-1 p-6 transition-all duration-300 overflow-x-hidden ${
          collapsed ? "ml-16" : "ml-64"
        }`}
      >
        <Topbar />
        <main className="p-4">
          <Outlet />
          {featureCardPaths.includes(location.pathname) && (
            <section className="mt-6">
              <FeatureCards />
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default Layout;
