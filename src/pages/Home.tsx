import React from "react";
import { motion } from "framer-motion";
import scholarKnightsPhoto from "../assets/scholar-knights-photo.png";

const Home: React.FC = () => {
  return (
    <div
      className="relative bg-cover bg-center h-[500px] flex items-center justify-center"
      style={{ backgroundImage: `url(${scholarKnightsPhoto})` }}
    >
    <motion.div
      style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
      className="text-white text-xl px-4 py-2 rounded-lg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2, delay: 0.5 }}
    >
      Unite your knowledge. Wield your potential.
    </motion.div>

    </div>
  );
};

export default Home;
