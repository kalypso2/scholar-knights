import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import FeatureCards from "./FeatureCards";
import { Outlet, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.5,
    },
  },
};

const childVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 1.2 } },
};

const Layout: React.FC = () => {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const location = useLocation();

  const featureCardPaths: string[] = ["/"];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <motion.div
        className={`flex-1 p-6 overflow-x-hidden ${
          collapsed ? "ml-16" : "ml-64"
        }`}
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={childVariants}>
          <Topbar />
        </motion.div>

        <main className="p-4 space-y-4">
          <motion.div variants={childVariants}>
            <Outlet />
          </motion.div>

          {featureCardPaths.includes(location.pathname) && (
            <motion.section variants={childVariants} className="mt-6">
              <FeatureCards />
            </motion.section>
          )}
        </main>
      </motion.div>
    </div>
  );
};

export default Layout;
